import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

//  useEffect(() => {
//    const loadToken = async () => {
//      const savedToken = await AsyncStorage.getItem('userToken');
//      if (savedToken) setToken(savedToken);
//    };
//    loadToken();
//  }, []);

useEffect(() => {
  // 🔧 Pular login temporariamente só pra testar
  setToken('TOKEN_FAKE_PARA_TESTE');
}, []);

  const signIn = async (newToken) => {
    await AsyncStorage.setItem('userToken', newToken);
    setToken(newToken);
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userToken');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};