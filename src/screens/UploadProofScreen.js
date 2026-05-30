import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import api from '../api/axiosConfig';
import { Feather } from '@expo/vector-icons';


const UploadProofScreen = ({ route, navigation }) => {
  const { courseId } = route.params || {};
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestPermission = async (type) => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    }
  };

  const handlePickImage = async (type) => {
    const hasPermission = await requestPermission(type);
    if (!hasPermission) {
      Alert.alert('Permissão Negada', `Precisamos de acesso à ${type === 'camera' ? 'câmera' : 'galeria'} para prosseguir.`);
      return;
    }

    let result;
    if (type === 'camera') {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAnalyzeOcr = async () => {
    if (!imageUri) {
      Alert.alert('Erro', 'Por favor, capture ou selecione uma imagem primeiro.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      
      const uriParts = imageUri.split('/');
      const fileName = uriParts[uriParts.length - 1];
      const fileType = fileName.split('.').pop();

      formData.append('arquivo', {
        uri: imageUri,
        name: fileName,
        type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
      });

      const response = await api.post('/api/certificates/ocr', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const { suggestedName, hours, text } = response.data;

      navigation.navigate('NewActivityDetails', {
        courseId,
        imageUri,
        suggestedName,
        hours,
        ocrText: text
      });

    } catch (error) {
      console.log(error);
      if (error.response) {
        Alert.alert('Falha na Análise (OCR)', 'O servidor não conseguiu processar o documento. Você pode prosseguir e preencher as informações manualmente.');
      } else {
        Alert.alert('Sem Conexão com o Servidor', 'Não conseguimos contatar o servidor para o processamento automático (OCR). Você pode continuar e preencher a atividade manualmente.');
      }
      navigation.navigate('NewActivityDetails', {
        courseId,
        imageUri,
        suggestedName: 'Certificado Submetido',
        hours: null,
        ocrText: ''
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Comprovante</Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.actionButton} onPress={() => handlePickImage('camera')}>
          <View style={styles.actionButtonContent}>
            <Feather name="camera" size={18} color="#333" style={{ marginRight: 6 }} />
            <Text style={styles.actionButtonText}>Câmera</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handlePickImage('gallery')}>
          <View style={styles.actionButtonContent}>
            <Feather name="image" size={18} color="#333" style={{ marginRight: 6 }} />
            <Text style={styles.actionButtonText}>Galeria</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.previewBox}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.previewImage} resizeMode="contain" />
        ) : (
          <View style={styles.placeholderContainer}>
            <View style={styles.placeholderIconContainer}>
              <Feather name="file-text" size={28} color="#004587" />
            </View>
            <Text style={styles.placeholderText}>Posicione o documento no centro da câmera</Text>
          </View>

        )}
      </View>

      <Text style={styles.infoText}>
        Certifique-se de que o documento esteja legível e completo.
      </Text>

      {imageUri && (
        <TouchableOpacity 
          style={[styles.continueButton, loading && styles.disabledButton]} 
          onPress={handleAnalyzeOcr}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>Analisar Comprovante (OCR)</Text>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={() => navigation.getParent()?.navigate('Dashboard')}
      >
        <Text style={styles.cancelButtonText}>Cancelar</Text>
      </TouchableOpacity>
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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  actionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  previewBox: {
    width: '100%',
    height: 350,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
    padding: 24,
  },
  placeholderIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f4f8',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#004587',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#004587',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: '#668bb0',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    width: '100%',
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

export default UploadProofScreen;
