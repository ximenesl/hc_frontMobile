import React, { useState, useEffect, useContext, useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import CircularProgressBar from '../components/CircularProgressBar';
import CategoryProgressBar from '../components/CategoryProgressBar';
import StatusCard from '../components/StatusCard';
import CourseSwitcherModal from '../components/CourseSwitcherModal';

const HomeScreen = ({ navigation }) => {
  const { user, activeCourseId, selectCourse, refreshProfile } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [courseRules, setCourseRules] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [courseModalVisible, setCourseModalVisible] = useState(false);

  const activeCourse = user?.cursos?.find(c => c.id === activeCourseId) || user?.cursos?.[0];

  const fetchDashboardData = useCallback(async () => {
    if (!user || !activeCourseId) return;
    try {
      setLoading(true);
      const rulesRes = await api.get(`/api/regras/curso/${activeCourseId}`);
      setCourseRules(rulesRes.data);

      const certsRes = await api.get(`/api/certificates/me/${user.id}?size=1000`);
      setCertificates(certsRes.data.content || []);
    } catch (error) {
      console.log(error);
      if (!error.response) {
        Alert.alert('Erro de Conexão', 'Não foi possível se conectar ao servidor. Verifique sua conexão.');
      } else {
        Alert.alert('Erro', 'Não foi possível carregar as informações do painel.');
      }
    } finally {
      setLoading(false);
    }
  }, [user, activeCourseId]);

  useEffect(() => {
    refreshProfile();
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const activeCertificates = certificates.filter(c => c.cursoId === activeCourseId);

  const pendingCount = activeCertificates.filter(c => c.status === 'PENDENTE').length;
  const approvedCount = activeCertificates.filter(c => c.status === 'APROVADO' || c.status === 'DEFERIDO' || c.status === 'VALIDADO').length;
  const rejectedCount = activeCertificates.filter(c => c.status === 'REJEITADO' || c.status === 'INDEFERIDO').length;

  const approvedHours = activeCertificates
    .filter(c => c.status === 'APROVADO' || c.status === 'DEFERIDO' || c.status === 'VALIDADO')
    .reduce((sum, c) => sum + (c.cargaHoraria || 0), 0);

  const requiredHours = activeCourse?.horasTotais || 100;
  const progressRatio = requiredHours > 0 ? Math.min(approvedHours / requiredHours, 1) : 0;

  const categories = ['Ensino', 'Pesquisa', 'Extensão'];
  
  const categoryProgress = categories.map(cat => {
    const catRules = courseRules.filter(r => r.tipo === cat);
    const catRuleIds = catRules.map(r => r.id);
    const catCerts = activeCertificates.filter(c => catRuleIds.includes(c.regraId) && (c.status === 'APROVADO' || c.status === 'DEFERIDO'));
    const catHours = catCerts.reduce((sum, c) => sum + (c.cargaHoraria || 0), 0);
    
    return {
      name: cat,
      hours: catHours,
      limit: 40,
    };
  });

  const handleSelectCourse = async (courseId) => {
    await selectCourse(courseId);
    setCourseModalVisible(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greetingText}>Olá, {user?.nome || 'Aluno'}!</Text>
          <Text style={styles.subGreetingText}>Acompanhe o progresso das suas atividades</Text>
        </View>
      </View>

      {user?.cursos && user.cursos.length > 1 ? (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.courseChipsContainer}
          contentContainerStyle={styles.courseChipsContent}
        >
          {user.cursos.map((c) => {
            const isActive = c.id === activeCourseId;
            return (
              <TouchableOpacity
                key={c.id}
                style={[styles.courseChip, isActive && styles.courseChipActive]}
                onPress={() => handleSelectCourse(c.id)}
              >
                <Text style={[styles.courseChipText, isActive && styles.courseChipTextActive]}>
                  {c.nome}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        activeCourse && (
          <View style={styles.courseBadge}>
            <Text style={styles.courseBadgeText}>{activeCourse.nome}</Text>
          </View>
        )
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#004587" style={styles.loader} />
      ) : (
        <>
          <View style={styles.progressCard}>
            <Text style={styles.cardTitle}>Minhas atividades</Text>
            
            <CircularProgressBar 
              approvedHours={approvedHours} 
              requiredHours={requiredHours} 
            />

            <View style={styles.progressPercentContainer}>
              <Text style={styles.progressPercentText}>
                {Math.round(progressRatio * 100)}% concluído
              </Text>
            </View>
          </View>

          <View style={styles.categoriesCard}>
            <Text style={styles.cardTitle}>Resumo por Categoria</Text>
            {categoryProgress.map((cat, index) => (
              <CategoryProgressBar
                key={index}
                name={cat.name}
                hours={cat.hours}
                limit={cat.limit}
              />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Status de solicitações</Text>
          
          <View style={styles.statusGrid}>
            <StatusCard status="PENDENTE" count={pendingCount} />
            <StatusCard status="APROVADO" count={approvedCount} />
            <StatusCard status="REJEITADO" count={rejectedCount} />
          </View>
        </>
      )}

      <CourseSwitcherModal
        visible={courseModalVisible}
        courses={user?.cursos}
        activeCourseId={activeCourseId}
        onSelectCourse={handleSelectCourse}
        onClose={() => setCourseModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreetingText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  courseSwitcher: {
    backgroundColor: '#004587',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  courseSwitcherText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  courseBadge: {
    backgroundColor: '#e6f0fa',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#b3d4f5',
  },
  courseBadgeText: {
    color: '#004587',
    fontSize: 12,
    fontWeight: '600',
  },
  courseChipsContainer: {
    marginVertical: 8,
    marginBottom: 16,
  },
  courseChipsContent: {
    paddingRight: 16,
  },
  courseChip: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  courseChipActive: {
    backgroundColor: '#004587',
    borderColor: '#004587',
  },
  courseChipText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '600',
  },
  courseChipTextActive: {
    color: '#ffffff',
  },
  loader: {
    marginTop: 40,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  progressPercentContainer: {
    marginTop: 16,
  },
  progressPercentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#eb8216',
  },
  categoriesCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default HomeScreen;
