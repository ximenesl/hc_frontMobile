import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, Alert, KeyboardAvoidingView, Platform, ScrollView, Image, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      console.log(error);
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403 || error.response.status === 404) {
          Alert.alert('Falha no Login', 'E-mail ou senha incorretos ou usuário não existe.');
        } else {
          Alert.alert('Falha no Login', 'Ocorreu um erro no servidor. Tente novamente.');
        }
      } else {
        Alert.alert('Falha no Login', 'Não foi possível conectar ao servidor. Verifique sua conexão e se o backend está rodando.');
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
          <Text style={styles.subtitleText}>Sistema de Horas Complementares</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Login</Text>

          <CustomInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="Digite seu e-mail"
            keyboardType="email-address"
          />

          <CustomInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            placeholder="Digite sua senha"
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotButton} onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotText}>Esqueceu a senha?</Text>
          </TouchableOpacity>

          <CustomButton
            title="Entrar"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
          />
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
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotText: {
    color: '#eb8216',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    marginTop: 8,
  },
});

export default LoginScreen;
