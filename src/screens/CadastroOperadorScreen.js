import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

export default function CadastroOperadorScreen() {
  const navigation = useNavigation();
  const [operador, setOperador] = useState('');

  useEffect(() => {
    buscarOperadorSalvo();
  }, []);

  const buscarOperadorSalvo = async () => {
    try {
      const operadorSalvo = await AsyncStorage.getItem('operador_nome');
      if (operadorSalvo) {
        setOperador(operadorSalvo);
      }
    } catch (error) {
      console.error('Erro ao buscar operador:', error);
    }
  };

  const salvarOperador = async () => {
    if (!operador.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Digite um nome para o operador.',
        topOffset: 60,
      });
      return;
    }
  
    try {
      await AsyncStorage.setItem('operador_nome', operador.trim());
  
      Toast.show({
        type: 'success',
        text1: '✅ Operador salvo!',
        text2: 'Você será redirecionado...',
        topOffset: 60,
      });
  
      // 🔥 Aguarda 1 segundo antes de voltar
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
  
    } catch (error) {
      console.error('Erro ao salvar operador:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível salvar. Tente novamente.',
        topOffset: 60,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Operador:</Text>
      <TextInput
        style={styles.input}
        value={operador}
        onChangeText={setOperador}
        placeholder="Digite o nome do operador"
        placeholderTextColor="#999"
      />
      <Button title="Salvar Operador" onPress={salvarOperador} color="#28a745" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    borderRadius: 6,
    fontSize: 16,
    color: '#000',
  },
});
