import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import formularioProducao from '../data/formularioProducao';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';

export default function FormListScreen() {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    carregarFormularios();
  }, []);

  const carregarFormularios = async () => {
    try {
      const response = {
        data: [
          {
            id: 1,
            titulo: 'Formulário de Produção',
            formulario: formularioProducao,
          },
        ],
      };
      setFormularios(response.data);
    } catch (error) {
      console.error('Erro ao carregar formulários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormPress = (item) => {
    console.log('📦 Item clicado:', item);

    if (!item.formulario) {
      Toast.show({ type: 'error', text1: 'Erro', text2: 'O formulário não está definido para este item.' });
      return;
    }

    navigation.navigate('FormScreen', {
      formulario: item.formulario,
    });
  };

  const transmitirPendentes = async () => {
    try {
      const state = await NetInfo.fetch();

      if (!state.isConnected) {
        Toast.show({ type: 'error', text1: 'Sem Internet', text2: 'Conecte-se à internet para transmitir.' });
        return;
      }

      const keys = await AsyncStorage.getAllKeys();
      const respostaKeys = keys.filter(key => key.startsWith('resposta_'));

      if (respostaKeys.length === 0) {
        Toast.show({ type: 'info', text1: 'Nada para transmitir', text2: 'Nenhum formulário pendente.' });
        return;
      }

      for (let i = 0; i < respostaKeys.length; i++) {
        const key = respostaKeys[i];
        const respostaString = await AsyncStorage.getItem(key);
        const respostaObj = JSON.parse(respostaString);

        Toast.show({
          type: 'info',
          text1: `Transmitindo ${i + 1} de ${respostaKeys.length}`,
          text2: respostaObj?.titulo || 'Formulário',
          visibilityTime: 800,
        });

        const preenchidoEm = respostaObj.preenchidoEm || '';
        const [data, hora] = preenchidoEm.split('T'); // quebra o ISO em Data e Hora
        const horaFormatada = hora ? hora.substring(0, 5) : ''; // só pega HH:MM

        await fetch('https://script.google.com/macros/s/AKfycbxrdCPUsKg9PMarmmSWQfUkUXEp0pc9-r6U4_bVDp1kaKcOavOEHe9B8CIE8dMfkSTrqw/exec', {
          method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            operador: respostaObj.respostas.operador || 'Operador Não Informado',
            data: data || '', // <-- Aqui agora vai a DATA do preenchimento
            hora: horaFormatada || '', // <-- Aqui agora vai a HORA do preenchimento
            tipo_servico: respostaObj.respostas.tipo_servico,
            lado: respostaObj.respostas.lado,
            escavadeira: respostaObj.respostas.escavadeira,
            prefixo_cb: respostaObj.respostas.prefixo_cb,
            origem_mat: respostaObj.respostas.origem_mat,
            origem_est_inicial: respostaObj.respostas.origem_est_inicial,
            origem_est_final: respostaObj.respostas.origem_est_final,
            servico_destino: respostaObj.respostas.servico_destino,
            destino_est_inicial: respostaObj.respostas.destino_est_inicial,
            destino_est_final: respostaObj.respostas.destino_est_final,
            material: respostaObj.respostas.material,
            observacao: respostaObj.respostas.observacao,
            qtd_viagens: respostaObj.respostas.qtd_viagens,
            carga: respostaObj.respostas.carga,
            volume_aterro: respostaObj.respostas.volume_aterro,
            bota_fora: respostaObj.respostas.bota_fora,
            volume_corte: respostaObj.respostas.volume_corte,
            volume_sub_base: respostaObj.respostas.volume_sub_base,
            volume_base: respostaObj.respostas.volume_base,
            volume_transportado: respostaObj.respostas.volume_transportado,
            dt_real_km: respostaObj.respostas.dt_real_km,
            dt_min_km: respostaObj.respostas.dt_min_km,
            valor_unitario: respostaObj.respostas.valor_unitario,
            valor_total: respostaObj.respostas.valor_total
          })
        });

        await AsyncStorage.removeItem(key);
      }

      Toast.show({ type: 'success', text1: 'Sucesso', text2: 'Todos os formulários pendentes foram transmitidos!' });

    } catch (error) {
      console.error('Erro ao transmitir pendentes:', error);
      Toast.show({ type: 'error', text1: 'Erro', text2: 'Falha ao transmitir formulários.' });
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleFormPress(item)}
    >
      <Text style={styles.titulo}>{item.titulo}</Text>
    </TouchableOpacity>
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
      <TouchableOpacity
        style={styles.botaoSalvos}
        onPress={() => navigation.navigate('FormSavedList')}
      >
        <Text style={styles.textoBotaoSalvos}>📁 Ver formulários salvos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.botaoSalvos, { backgroundColor: '#28a745' }]}
        onPress={transmitirPendentes}
      >
        <Text style={styles.textoBotaoSalvos}>🚀 Transmitir Pendentes</Text>
      </TouchableOpacity>

      <FlatList
        data={formularios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
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
  titulo: { fontSize: 16, fontWeight: '600' },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  botaoSalvos: {
    backgroundColor: '#004f9f',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  textoBotaoSalvos: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
  },
});