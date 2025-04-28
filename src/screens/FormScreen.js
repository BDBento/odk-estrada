import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useNavigation, useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function FormScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const {formulario} = route.params ?? {};

  const [respostas, setRespostas] = useState({});
  const [operador, setOperador] = useState('');

  useEffect(() => {
    carregarOperadorSalvo();
  }, []);

  const carregarOperadorSalvo = async () => {
    try {
      const nomeOperador = await AsyncStorage.getItem('operador_nome');
      if (nomeOperador) {
        setOperador(nomeOperador);
      }
    } catch (error) {
      console.error('Erro ao carregar operador:', error);
    }
  };

  if (!formulario) {
    return (
      <View style={styles.loading}>
        <Text style={{color: 'red'}}>❌ Nenhum formulário enviado.</Text>
      </View>
    );
  }

  const handleChange = (id, valor) => {
    setRespostas({...respostas, [id]: valor});
  };

  const handleSubmit = async () => {
    try {
      if (!operador) {
        Toast.show({
          type: 'error',
          text1: 'Operador não cadastrado!',
          text2: 'Cadastre um operador antes de salvar.',
          topOffset: 60,
        });
        return;
      }

      const agora = new Date();
      const dataPreenchimento = agora.toISOString().split('T')[0]; // YYYY-MM-DD
      const horaPreenchimento = agora
        .toTimeString()
        .split(' ')[0]
        .substring(0, 5); // HH:MM

      const respostaComMeta = {
        idFormulario: formulario.id,
        titulo: formulario.titulo,
        preenchidoEm: agora.toISOString(),
        respostas: {
          ...respostas,
          operador,
          data: dataPreenchimento,
          hora: horaPreenchimento,
        },
      };

      const chave = `resposta_${formulario.id}_${agora.getTime()}`;
      await AsyncStorage.setItem(chave, JSON.stringify(respostaComMeta));

      Toast.show({
        type: 'success',
        text1: '✅ Formulário salvo!',
        text2: 'Salvo localmente com sucesso.',
        topOffset: 60,
      });

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar formulário:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível salvar.',
        topOffset: 60,
      });
    }
  };

  const transmitirPendentes = async () => {
    try {
      const state = await NetInfo.fetch();
      if (!state.isConnected) {
        Toast.show({
          type: 'error',
          text1: 'Sem Internet',
          text2: 'Conecte-se para transmitir.',
          topOffset: 60,
        });
        return;
      }

      const keys = await AsyncStorage.getAllKeys();
      const respostaKeys = keys.filter(key => key.startsWith('resposta_'));

      if (respostaKeys.length === 0) {
        Toast.show({
          type: 'info',
          text1: 'Nada para transmitir',
          text2: 'Nenhum formulário pendente.',
          topOffset: 60,
        });
        return;
      }

      for (let i = 0; i < respostaKeys.length; i++) {
        const key = respostaKeys[i];
        const respostaString = await AsyncStorage.getItem(key);
        const respostaObj = JSON.parse(respostaString);

        Toast.show({
          type: 'info',
          text1: `Transmitindo ${i + 1} de ${respostaKeys.length}...`,
          text2: respostaObj?.titulo || 'Formulário',
          topOffset: 60,
          visibilityTime: 800,
        });

        await fetch(
          'https://script.google.com/macros/s/AKfycbxrdCPUsKg9PMarmmSWQfUkUXEp0pc9-r6U4_bVDp1kaKcOavOEHe9B8CIE8dMfkSTrqw/exec',
          {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(respostaObj.respostas),
          },
        );

        await AsyncStorage.removeItem(key);
      }

      Toast.show({
        type: 'success',
        text1: '🎉 Sucesso!',
        text2: 'Todos os formulários transmitidos.',
        topOffset: 60,
      });
    } catch (error) {
      console.error('Erro ao transmitir pendentes:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro',
        text2: 'Não foi possível transmitir.',
        topOffset: 60,
      });
    }
  };

  const renderCampo = campo => {
    switch (campo.tipo) {
      case 'texto':
      case 'numero':
        return (
          <TextInput
            key={campo.id}
            style={styles.input}
            placeholder={campo.label}
            placeholderTextColor="#666"
            keyboardType={campo.tipo === 'numero' ? 'numeric' : 'default'}
            onChangeText={valor => handleChange(campo.id, valor)}
            value={respostas[campo.id] || ''}
          />
        );
      case 'checkbox':
        return (
          <View key={campo.id} style={styles.checkboxContainer}>
            <Text>{campo.label}</Text>
            <Switch
              value={!!respostas[campo.id]}
              onValueChange={valor => handleChange(campo.id, valor)}
            />
          </View>
        );
      case 'selecao':
      case 'select':
        return (
          <View key={campo.id} style={styles.pickerContainer}>
            <Text style={styles.labelSelect}>{campo.label}</Text>
            <Picker
              selectedValue={respostas[campo.id] || ''}
              onValueChange={valor => handleChange(campo.id, valor)}
              style={{
                color: '#000', // texto preto
                backgroundColor: '#fff', // fundo branco
                borderWidth: 1, // borda (opcional para ficar mais bonito)
                borderColor: '#ccc', // cor da borda
                borderRadius: 6, // bordas arredondadas
                marginBottom: 12, // espaço abaixo
              }}>
              <Picker.Item label="Selecione..." value="" color="#000" />
              {campo.opcoes.map(op => (
                <Picker.Item label={op} value={op} key={op} color="#000" />
              ))}
            </Picker>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <View style={styles.operadorContainer}>
        {operador ? (
          <>
            <Icon name="user-check" size={18} color="#28a745" />
            <Text style={styles.operadorNome}>Operador: {operador}</Text>
          </>
        ) : (
          <>
            <Icon name="user-times" size={18} color="#dc3545" />
            <Text style={styles.operadorNome}>Operador não cadastrado</Text>
          </>
        )}
      </View>

      <Text style={styles.titulo}>{formulario.titulo}</Text>
      {formulario.campos.map(renderCampo)}

      <Button title="Salvar Formulário" onPress={handleSubmit} />
      <View style={{height: 10}} />
      <Button
        title="Transmitir Pendentes"
        onPress={transmitirPendentes}
        color="#28a745"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {padding: 16, backgroundColor: '#fff'},
  titulo: {fontSize: 20, fontWeight: 'bold', marginBottom: 20},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 12,
    borderRadius: 6,
    color: '#000',
  },
  scrollContent: {paddingBottom: 40},
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    alignItems: 'center',
  },
  pickerContainer: {marginBottom: 12},
  picker: {color: '#000', backgroundColor: '#f5f5f5'},
  labelSelect: {marginBottom: 5, fontWeight: 'bold', color: '#333'},
  operadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  operadorNome: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
});
