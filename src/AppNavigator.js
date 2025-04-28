import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import FormListScreen from './screens/FormListScreen';
import FormScreen from './screens/FormScreen';
import FormSavedListScreen from './screens/FormSavedListScreen';
import FormRespostaDetalhe from './screens/FormRespostaDetalhe';
import CadastroOperadorScreen from './screens/CadastroOperadorScreen';
import TelaPendentes from './screens/TelaPendentes';
import LoginScreen from './screens/LoginScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="FormList">
        <Stack.Screen name="FormList" component={FormListScreen} options={{ title: 'Formulários' }} />
        <Stack.Screen name="FormScreen" component={FormScreen} options={{ title: 'Formulário' }} />
        <Stack.Screen name="FormSavedList" component={FormSavedListScreen} options={{ title: 'Formulários Salvos' }} />
        <Stack.Screen name="FormRespostaDetalhe" component={FormRespostaDetalhe} options={{ title: 'Detalhe da Resposta' }} />
        <Stack.Screen name="CadastroOperador" component={CadastroOperadorScreen} options={{ title: 'Cadastro de Operador' }} />
        <Stack.Screen name="TelaPendentes" component={TelaPendentes} options={{ title: 'Transmitir Pendentes' }} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
