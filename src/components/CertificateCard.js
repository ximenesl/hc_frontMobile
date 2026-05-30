import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const CertificateCard = ({ item, onPress }) => {
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

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.nome}</Text>
        <View style={[styles.badge, getStatusBadgeStyle(item.status)]}>
          <Text style={styles.badgeText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Curso:</Text>
        <Text style={styles.detailValue}>{item.cursoNome || 'Não informado'}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Categoria:</Text>
        <Text style={styles.detailValue}>{item.regraDescricao || 'Geral'}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.hoursText}>{item.cargaHoraria} horas</Text>
        <Text style={styles.dateText}>{item.dataEmissao}</Text>
      </View>

      {item.justificativa && (
        <View style={styles.rejectionBox}>
          <Text style={styles.rejectionTitle}>Motivo da Rejeição:</Text>
          <Text style={styles.rejectionText}>{item.justificativa}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  badge: {
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
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    width: 80,
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  hoursText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#004587',
  },
  dateText: {
    fontSize: 12,
    color: '#999',
  },
  rejectionBox: {
    backgroundColor: '#fdf3f4',
    borderLeftWidth: 3,
    borderLeftColor: '#dc3545',
    padding: 10,
    borderRadius: 4,
    marginTop: 12,
  },
  rejectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 2,
  },
  rejectionText: {
    fontSize: 12,
    color: '#555',
  },
});

export default CertificateCard;
