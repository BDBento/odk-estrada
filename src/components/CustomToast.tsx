import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#4CAF50', borderRadius: 8, elevation: 5 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2e7d32',
      }}
      text2Style={{
        fontSize: 14,
        color: '#2e7d32',
      }}
      trailingIcon={{
        name: 'check',
        color: '#4CAF50',
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#f44336', borderRadius: 8, elevation: 5 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#c62828',
      }}
      text2Style={{
        fontSize: 14,
        color: '#c62828',
      }}
    />
  ),
  info: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#2196F3', borderRadius: 8, elevation: 5 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1565c0',
      }}
      text2Style={{
        fontSize: 14,
        color: '#1565c0',
      }}
    />
  ),
};
