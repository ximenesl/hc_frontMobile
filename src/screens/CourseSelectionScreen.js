import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';

const CourseSelectionScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const { name, duration, description, category, imageUri } = route.params || {};
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleToggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleConfirm = async () => {
    if (selectedIds.length === 0) {
      Alert.alert('Erro', 'Por favor, selecione pelo menos um curso.');
      return;
    }

    try {
      setSubmitting(true);

      for (const courseId of selectedIds) {
        const rulesRes = await api.get(`/api/regras/curso/${courseId}`);
        const matchedRule = rulesRes.data.find(
          r => r.tipo.toLowerCase() === category.toLowerCase()
        ) || rulesRes.data[0];

        if (!matchedRule) {
          throw new Error(`Nenhuma regra encontrada para o curso ID: ${courseId}`);
        }

        const formData = new FormData();
        formData.append('alunoId', user.id);
        formData.append('nome', name);
        formData.append('cargaHoraria', duration);
        
        const today = new Date().toISOString().split('T')[0];
        formData.append('dataEmissao', today);
        formData.append('regraId', matchedRule.id);

        const uriParts = imageUri.split('/');
        const fileName = uriParts[uriParts.length - 1];
        const fileType = fileName.split('.').pop();

        formData.append('arquivo', {
          uri: imageUri,
          name: fileName,
          type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
        });

        await api.post('/api/certificates', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      Alert.alert('Sucesso', 'Atividade vinculada e enviada com sucesso!', [
        {
          text: 'OK',
          onPress: () => {
            navigation.getParent()?.navigate('Dashboard');
          },
        },
      ]);

    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível vincular a atividade aos cursos selecionados. Tente novamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.headerTitle}>Vincular aos Cursos</Text>
        <Text style={styles.instructionText}>
          Selecione para qual curso (ou cursos) deseja aplicar as horas desta atividade.
        </Text>

        {user?.cursos?.map((course) => {
          const isSelected = selectedIds.includes(course.id);

          return (
            <TouchableOpacity
              key={course.id}
              style={[styles.courseCard, isSelected && styles.courseCardSelected]}
              onPress={() => handleToggleSelection(course.id)}
              disabled={submitting}
            >
              <View style={styles.cardHeader}>
                <View style={styles.textContainer}>
                  <Text style={[styles.courseName, isSelected && styles.courseNameSelected]}>
                    {course.nome}
                  </Text>
                  <Text style={styles.courseSigla}>{course.sigla || 'Graduação'}</Text>
                </View>
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <View style={styles.checkboxInner} />}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.confirmButton, submitting && styles.disabledButton]} 
          onPress={handleConfirm}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar e Enviar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.cancelButton} 
          onPress={() => navigation.goBack()}
          disabled={submitting}
        >
          <Text style={styles.cancelButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  courseCard: {
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
  courseCardSelected: {
    borderColor: '#004587',
    backgroundColor: '#f0f4f8',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  courseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  courseNameSelected: {
    color: '#004587',
  },
  courseSigla: {
    fontSize: 12,
    color: '#666',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: '#004587',
    backgroundColor: '#004587',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  confirmButton: {
    backgroundColor: '#004587',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  disabledButton: {
    backgroundColor: '#668bb0',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CourseSelectionScreen;
