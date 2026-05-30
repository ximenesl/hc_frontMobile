import React, { useState } from 'react';
import { StyleSheet, Text, View, Alert, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import api from '../api/axiosConfig';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecover = async () => {
    if (!email) {
      Alert.alert('Erro', 'Por favor, preencha o seu e-mail.');
      return;
    }
    try {
      setLoading(true);
      await api.post('/api/auth/forgot-password', { email });
      Alert.alert(
        'Sucesso',
        'Uma nova senha temporária foi enviada para o seu e-mail.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 404) {
          Alert.alert('Recuperação de Senha', 'Este e-mail não foi encontrado em nosso sistema.');
        } else {
          Alert.alert('Recuperação de Senha', 'Ocorreu um erro no servidor ao tentar recuperar a senha.');
        }
      } else {
        Alert.alert('Recuperação de Senha', 'Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está rodando.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo-senac.png')}
            style={styles.logoImage}
          />
          <Text style={styles.subtitleText}>Recuperação de Senha</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.infoText}>
            Informe seu e-mail cadastrado e enviaremos uma nova senha temporária para você.
          </Text>

          <CustomInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
          />

          <CustomButton
            title="Recuperar Senha"
            onPress={handleRecover}
            loading={loading}
            style={styles.recoverButton}
          />

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.backButtonText}>Voltar para o Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004587',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoImage: {
    width: 380,
    height: 160,
    resizeMode: 'contain',
    marginBottom: -20,
  },
  subtitleText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  recoverButton: {
    marginTop: 16,
    marginBottom: 16,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#eb8216',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ForgotPasswordScreen;
