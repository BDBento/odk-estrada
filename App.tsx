import React from 'react';
import AppNavigator from './src/AppNavigator';
import {AuthProvider} from './src/contexts/AuthContext';
import Toast from 'react-native-toast-message';
import {toastConfig} from './src/components/CustomToast'; // importa o toastConfig

export default function App() {
  return (
    <AuthProvider>
      <>
        <AppNavigator />
        <Toast
          config={toastConfig}
          topOffset={60} // distância do topo
          visibilityTime={2500} // tempo que o toast fica visível
          autoHide
        />
      </>
    </AuthProvider>
  );
}
