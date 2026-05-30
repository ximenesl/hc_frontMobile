import React, { createContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axiosConfig';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [activeCourseId, setActiveCourseId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStorageData = useCallback(async () => {
    try {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      const storedActiveCourse = await AsyncStorage.getItem('activeCourseId');

      if (storedToken && storedUser) {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        if (storedActiveCourse) {
          setActiveCourseId(Number(storedActiveCourse));
        } else if (parsedUser.cursos && parsedUser.cursos.length > 0) {
          const defaultCourseId = parsedUser.cursos[0].id;
          setActiveCourseId(defaultCourseId);
          await AsyncStorage.setItem('activeCourseId', String(defaultCourseId));
        }
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStorageData();
  }, [loadStorageData]);

  const login = async (email, senha) => {
    const response = await api.post('/api/auth/login', { email, senha });
    const { token: jwtToken } = response.data;
    
    await AsyncStorage.setItem('token', jwtToken);
    
    const profileResponse = await api.get('/api/users/me', {
      headers: { Authorization: `Bearer ${jwtToken}` }
    });
    
    const profile = profileResponse.data;
    await AsyncStorage.setItem('user', JSON.stringify(profile));
    
    setToken(jwtToken);
    setUser(profile);

    if (profile.cursos && profile.cursos.length > 0) {
      const defaultCourseId = profile.cursos[0].id;
      setActiveCourseId(defaultCourseId);
      await AsyncStorage.setItem('activeCourseId', String(defaultCourseId));
    } else {
      setActiveCourseId(null);
      await AsyncStorage.removeItem('activeCourseId');
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('activeCourseId');
    setToken(null);
    setUser(null);
    setActiveCourseId(null);
  };

  const selectCourse = async (courseId) => {
    setActiveCourseId(courseId);
    await AsyncStorage.setItem('activeCourseId', String(courseId));
  };

  const refreshProfile = async () => {
    if (!token) return;
    try {
      const profileResponse = await api.get('/api/users/me');
      const profile = profileResponse.data;
      await AsyncStorage.setItem('user', JSON.stringify(profile));
      setUser(profile);
      
      if (profile.cursos && profile.cursos.length > 0) {
        if (!activeCourseId || !profile.cursos.some(c => c.id === activeCourseId)) {
          const defaultCourseId = profile.cursos[0].id;
          setActiveCourseId(defaultCourseId);
          await AsyncStorage.setItem('activeCourseId', String(defaultCourseId));
        }
      } else {
        setActiveCourseId(null);
        await AsyncStorage.removeItem('activeCourseId');
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{
      signed: !!token,
      user,
      token,
      activeCourseId,
      loading,
      login,
      logout,
      selectCourse,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};
