import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const NewActivityScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const { imageUri, suggestedName, hours } = route.params || {};

  const [category, setCategory] = useState('Ensino');
  const [name, setName] = useState(suggestedName || '');
  const [duration, setDuration] = useState(hours ? String(hours) : '');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome da atividade.');
      return;
    }
    if (!duration.trim() || isNaN(Number(duration))) {
      Alert.alert('Erro', 'Por favor, informe uma carga horária válida.');
      return;
    }

    const userCursos = user?.cursos || [];
    
    if (userCursos.length > 1) {
      navigation.navigate('ChooseCourse', {
        name,
        duration: Number(duration),
        description,
        category,
        imageUri,
      });
    } else {
      const singleCourseId = userCursos[0]?.id;
      if (!singleCourseId) {
        Alert.alert('Erro', 'Nenhum curso associado a este aluno.');
        return;
      }

      try {
        setSubmitting(true);
        const rulesRes = await api.get(`/api/regras/curso/${singleCourseId}`);
        const matchedRule = rulesRes.data.find(
          r => r.tipo.toLowerCase() === category.toLowerCase()
        ) || rulesRes.data[0];

        if (!matchedRule) {
          Alert.alert('Erro', 'Nenhuma regra encontrada para este curso.');
          return;
        }

        const formData = new FormData();
        formData.append('alunoId', user.id);
        formData.append('nome', name);
        formData.append('cargaHoraria', Number(duration));
        
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

        Alert.alert('Sucesso', 'Atividade enviada para validação com sucesso!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.getParent()?.navigate('Dashboard');
            },
          },
        ]);

      } catch (error) {
        console.log(error);
        Alert.alert('Erro', 'Não foi possível enviar a atividade. Tente novamente.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Nova Atividade</Text>

      <Text style={styles.label}>Categoria *</Text>
      <View style={styles.categoryRow}>
        {['Ensino', 'Pesquisa', 'Extensão'].map((cat) => {
          const isActive = category === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <CustomInput
        label="Nome da atividade *"
        value={name}
        onChangeText={setName}
        placeholder="Ex: Curso de Excel Avançado"
      />

      <CustomInput
        label="Carga horária (horas) *"
        value={duration}
        onChangeText={setDuration}
        placeholder="Ex: 20"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Descrição da atividade</Text>
      <View style={styles.textAreaContainer}>
        <TextInput
          style={styles.textArea}
          value={description}
          onChangeText={(text) => text.length <= 300 && setDescription(text)}
          placeholder="Descreva brevemente sua participação nesta atividade..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
        />
        <Text style={styles.charCount}>{description.length}/300</Text>
      </View>

      <CustomButton
        title={user?.cursos?.length > 1 ? 'Avançar para Cursos' : 'Continuar'}
        onPress={handleContinue}
        loading={submitting}
        style={styles.submitButton}
      />

      <CustomButton
        title="Cancelar"
        onPress={() => navigation.getParent()?.navigate('Dashboard')}
        type="secondary"
        style={styles.cancelButton}
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
    padding: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginTop: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryChip: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  categoryChipActive: {
    backgroundColor: '#004587',
    borderColor: '#004587',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#333',
    fontWeight: 'bold',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  textAreaContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  textArea: {
    fontSize: 15,
    color: '#333',
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    alignSelf: 'flex-end',
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 40,
  },
});

export default NewActivityScreen;
