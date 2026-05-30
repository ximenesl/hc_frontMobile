import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInput, Modal, Image, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import CertificateCard from '../components/CertificateCard';

const CertificateListScreen = () => {
  const { user, activeCourseId, token } = useContext(AuthContext);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const ITEMS_PER_PAGE = 5;

  const fetchCertificates = useCallback(async () => {
    if (!user || !activeCourseId) return;
    try {
      setLoading(true);
      const res = await api.get(`/api/certificates/me/${user.id}?cursoId=${activeCourseId}&page=0&size=1000`);
      setCertificates(res.data.content || []);
      setCurrentPage(0);
    } catch (error) {
      console.log(error);
      if (!error.response) {
        Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor para listar seus certificados.');
      } else {
        Alert.alert('Erro', 'Não foi possível carregar a lista de certificados.');
      }
    } finally {
      setLoading(false);
    }
  }, [user, activeCourseId]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const filteredCertificates = certificates.filter((c) => {
    const matchesSearch = c.nome.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'PENDENTE') {
      matchesStatus = c.status === 'PENDENTE';
    } else if (statusFilter === 'APROVADO') {
      matchesStatus = c.status === 'APROVADO' || c.status === 'DEFERIDO' || c.status === 'VALIDADO';
    } else if (statusFilter === 'REJEITADO') {
      matchesStatus = c.status === 'REJEITADO' || c.status === 'INDEFERIDO';
    }

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCertificates.length / ITEMS_PER_PAGE);
  const paginatedCertificates = filteredCertificates.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleCardPress = (cert) => {
    setSelectedCertificate(cert);
    setModalVisible(true);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDENTE':
        return 'Pendente';
      case 'APROVADO':
      case 'DEFERIDO':
      case 'VALIDADO':
        return 'Aprovado';
      case 'REJEITADO':
      case 'INDEFERIDO':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'PENDENTE':
        return styles.badgePending;
      case 'APROVADO':
      case 'DEFERIDO':
      case 'VALIDADO':
        return styles.badgeApproved;
      case 'REJEITADO':
      case 'INDEFERIDO':
        return styles.badgeRejected;
      default:
        return styles.badgePending;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar certificados..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
            setCurrentPage(0);
          }}
        />
      </View>

      <View style={styles.filterRow}>
        {[
          { id: 'ALL', label: 'Todos' },
          { id: 'PENDENTE', label: 'Pendentes' },
          { id: 'APROVADO', label: 'Aprovados' },
          { id: 'REJEITADO', label: 'Rejeitados' },
        ].map((filter) => {
          const isActive = statusFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => {
                setStatusFilter(filter.id);
                setCurrentPage(0);
              }}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading && certificates.length === 0 ? (
        <ActivityIndicator size="large" color="#004587" style={styles.loader} />
      ) : (
        <FlatList
          data={paginatedCertificates}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <CertificateCard 
              item={item} 
              onPress={() => handleCardPress(item)} 
            />
          )}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Nenhum certificado encontrado.</Text>
            </View>
          }
        />
      )}

      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[styles.pageButton, currentPage === 0 && styles.pageButtonDisabled]}
            onPress={() => currentPage > 0 && setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0 || loading}
          >
            <Text style={styles.pageButtonText}>Anterior</Text>
          </TouchableOpacity>

          <Text style={styles.pageIndicator}>
            Página {currentPage + 1} de {totalPages}
          </Text>

          <TouchableOpacity
            style={[styles.pageButton, currentPage === totalPages - 1 && styles.pageButtonDisabled]}
            onPress={() => currentPage < totalPages - 1 && setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages - 1 || loading}
          >
            <Text style={styles.pageButtonText}>Próxima</Text>
          </TouchableOpacity>
        </View>
      )}

      {selectedCertificate && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {selectedCertificate.nome}
                </Text>
                <TouchableOpacity 
                  style={styles.closeHeaderButton} 
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeHeaderButtonText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView contentContainerStyle={styles.modalBody}>
                <View style={styles.modalDetailGroup}>
                  <Text style={styles.modalDetailLabel}>Status</Text>
                  <View style={[styles.badge, getStatusBadgeStyle(selectedCertificate.status)]}>
                    <Text style={styles.badgeText}>
                      {getStatusLabel(selectedCertificate.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalDetailGroup}>
                  <Text style={styles.modalDetailLabel}>Curso</Text>
                  <Text style={styles.modalDetailValue}>{selectedCertificate.cursoNome}</Text>
                </View>

                <View style={styles.modalDetailGroup}>
                  <Text style={styles.modalDetailLabel}>Categoria (Regra)</Text>
                  <Text style={styles.modalDetailValue}>{selectedCertificate.regraDescricao || 'Geral'}</Text>
                </View>

                <View style={styles.modalDetailGroup}>
                  <Text style={styles.modalDetailLabel}>Carga Horária</Text>
                  <Text style={styles.modalDetailValue}>{selectedCertificate.cargaHoraria} horas</Text>
                </View>

                {selectedCertificate.horasValidadas !== null && (
                  <View style={styles.modalDetailGroup}>
                    <Text style={styles.modalDetailLabel}>Horas Validadas pela Coordenação</Text>
                    <Text style={styles.modalDetailValue}>{selectedCertificate.horasValidadas} horas</Text>
                  </View>
                )}

                <View style={styles.modalDetailGroup}>
                  <Text style={styles.modalDetailLabel}>Data de Emissão</Text>
                  <Text style={styles.modalDetailValue}>{selectedCertificate.dataEmissao}</Text>
                </View>

                {selectedCertificate.justificativa && (
                  <View style={styles.rejectionBox}>
                    <Text style={styles.rejectionTitle}>Motivo da Rejeição</Text>
                    <Text style={styles.rejectionText}>{selectedCertificate.justificativa}</Text>
                  </View>
                )}

                <Text style={styles.proofTitle}>Comprovante Enviado</Text>
                
                {selectedCertificate.arquivoTipo && selectedCertificate.arquivoTipo.includes('pdf') ? (
                  <View style={styles.pdfContainer}>
                    <View style={styles.pdfIcon} />
                    <Text style={styles.pdfText}>Documento em formato PDF</Text>
                  </View>
                ) : (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{
                        uri: `http://10.0.2.2:8080/api/certificates/${selectedCertificate.id}/file`,
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      }}
                      style={styles.proofImage}
                      resizeMode="contain"
                    />
                  </View>
                )}
              </ScrollView>

              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  filterChip: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterChipActive: {
    backgroundColor: '#004587',
  },
  filterChipText: {
    fontSize: 11,
    color: '#495057',
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  pageButton: {
    backgroundColor: '#004587',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  pageButtonDisabled: {
    backgroundColor: '#ccc',
  },
  pageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pageIndicator: {
    fontSize: 14,
    color: '#555',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#004587',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    marginRight: 12,
  },
  closeHeaderButton: {
    padding: 4,
  },
  closeHeaderButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  modalDetailGroup: {
    marginBottom: 12,
  },
  modalDetailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  modalDetailValue: {
    fontSize: 14,
    color: '#333',
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgePending: {
    backgroundColor: '#fff3cd',
  },
  badgeApproved: {
    backgroundColor: '#d4edda',
  },
  badgeRejected: {
    backgroundColor: '#f8d7da',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333',
  },
  rejectionBox: {
    backgroundColor: '#fdf3f4',
    borderLeftWidth: 3,
    borderLeftColor: '#dc3545',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  rejectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 13,
    color: '#555',
  },
  proofTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  proofImage: {
    width: '100%',
    height: '100%',
  },
  pdfContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfIcon: {
    width: 40,
    height: 45,
    backgroundColor: '#dc3545',
    borderRadius: 4,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#dc3545',
  },
  pdfText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#004587',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CertificateListScreen;
