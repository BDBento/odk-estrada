import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function FormSavedListScreen() {
  const [respostasSalvas, setRespostasSalvas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    carregarFormulariosSalvos();
  }, []);

  const carregarFormulariosSalvos = async () => {
    try {
      const todasAsChaves = await AsyncStorage.getAllKeys();
      const chavesDeRespostas = todasAsChaves.filter((key) =>
        key.startsWith('resposta_')
      );

      const dados = await AsyncStorage.multiGet(chavesDeRespostas);
      const respostas = dados.map(([key, value]) => {
        const objeto = JSON.parse(value);
        return {
          ...objeto,
          chave: key, // ⬅️ Enviamos a chave junto para facilitar exclusão
        };
      });

      setRespostasSalvas(respostas.reverse()); // mostra os mais recentes primeiro
    } catch (error) {
      console.error('Erro ao carregar respostas salvas:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('FormRespostaDetalhe', {
          resposta: item,
          chave: item.chave, // ⬅️ Passamos a chave pra próxima tela
        })
      }
    >
      <Text style={styles.titulo}>{item.titulo}</Text>
      <Text style={styles.subtitulo}>Preenchido em: {item.preenchidoEm}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#004f9f" />
      </View>
    );
  }

  if (respostasSalvas.length === 0) {
    return (
      <View style={styles.loading}>
        <Text>Nenhum formulário salvo localmente.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={respostasSalvas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  card: {
    backgroundColor: '#e8f0fe',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  titulo: { fontSize: 16, fontWeight: 'bold' },
  subtitulo: { fontSize: 13, marginTop: 4, color: '#555' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
