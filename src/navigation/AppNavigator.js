import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import CourseSelectionScreen from '../screens/CourseSelectionScreen';
import UploadProofScreen from '../screens/UploadProofScreen';
import NewActivityScreen from '../screens/NewActivityScreen';
import CertificateListScreen from '../screens/CertificateListScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

const NewActivityStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UploadProof" component={UploadProofScreen} />
      <Stack.Screen name="NewActivityDetails" component={NewActivityScreen} />
      <Stack.Screen name="ChooseCourse" component={CourseSelectionScreen} />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#004587',
          height: 80,
        },
        headerTitleAlign: 'center',
        headerTitle: () => (
          <Image
            source={require('../../assets/logo-senac.png')}
            style={{ width: 140, height: 42, resizeMode: 'contain' }}
          />
        ),
        tabBarActiveTintColor: '#eb8216',
        tabBarInactiveTintColor: '#666666',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e9ecef',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, focused }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'SubmitActivity') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'MyCertificates') {
            iconName = focused ? 'document-text' : 'document-text-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={HomeScreen} 
        options={{ tabBarLabel: 'Início' }}
      />
      <Tab.Screen 
        name="SubmitActivity" 
        component={NewActivityStack} 
        options={{ tabBarLabel: 'Nova Atividade' }}
      />
      <Tab.Screen 
        name="MyCertificates" 
        component={CertificateListScreen} 
        options={{ tabBarLabel: 'Certificados' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { signed, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color="#004587" />
      </View>
    );
  }

  return signed ? <MainTabs /> : <AuthStack />;
};

export default AppNavigator;
