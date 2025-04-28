import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

export default function TelaPendentes() {
  const [pendentes, setPendentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    carregarPendentes();
  }, []);

  const carregarPendentes = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const respostaKeys = keys.filter(key => key.startsWith('resposta_'));

      const respostas = await AsyncStorage.multiGet(respostaKeys);
      const lista = respostas.map(([key, value]) => ({
        key,
        data: JSON.parse(value)
      }));

      setPendentes(lista);
    } catch (error) {
      console.error('Erro ao carregar pendentes:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível carregar os pendentes.',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const transmitirTodos = async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        Toast.show({ type: 'error', text1: 'Sem Internet', text2: 'Conecte-se para transmitir.' });
        return;
      }

      if (pendentes.length === 0) {
        Toast.show({ type: 'info', text1: 'Nada para transmitir', text2: 'Nenhum formulário pendente.' });
        return;
      }

      for (let i = 0; i < pendentes.length; i++) {
        const item = pendentes[i];

        Toast.show({
          type: 'info',
          text1: `Transmitindo ${i + 1} de ${pendentes.length}...`,
          text2: item.data?.titulo || 'Formulário',
          visibilityTime: 800,
        });

        await fetch('https://script.google.com/macros/s/AKfycbxrdCPUsKg9PMarmmSWQfUkUXEp0pc9-r6U4_bVDp1kaKcOavOEHe9B8CIE8dMfkSTrqw/exec', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            operador: item.data.respostas.operador || 'Operador Não Informado',
            data: item.data.respostas.data,
            hora: item.data.respostas.hora,
            tipo_servico: item.data.respostas.tipo_servico,
            lado: item.data.respostas.lado,
            escavadeira: item.data.respostas.escavadeira,
            prefixo_cb: item.data.respostas.prefixo_cb,
            origem_mat: item.data.respostas.origem_mat,
            origem_est_inicial: item.data.respostas.origem_est_inicial,
            origem_est_final: item.data.respostas.origem_est_final,
            servico_destino: item.data.respostas.servico_destino,
            destino_est_inicial: item.data.respostas.destino_est_inicial,
            destino_est_final: item.data.respostas.destino_est_final,
            material: item.data.respostas.material,
            observacao: item.data.respostas.observacao,
            
          })
        });

        await AsyncStorage.removeItem(item.key);
      }

      Toast.show({ type: 'success', text1: '🎉 Sucesso!', text2: 'Todos os formulários transmitidos.' });
      carregarPendentes();

    } catch (error) {
      console.error('Erro ao transmitir pendentes:', error);
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Falha ao transmitir formulários.' });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    carregarPendentes();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.titulo}>{item.data.titulo}</Text>
      <Text style={styles.subtitulo}>Preenchido em: {new Date(item.data.preenchidoEm).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#004f9f" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.botaoTransmitir} onPress={transmitirTodos}>
        <Text style={styles.textoBotao}>🚀 Transmitir Todos ({pendentes.length})</Text>
      </TouchableOpacity>
      <FlatList
        data={pendentes}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  card: {
    backgroundColor: '#f1f1f1',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  titulo: { fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  subtitulo: { fontSize: 13, color: '#666' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  botaoTransmitir: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
  },
  textoBotao: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});