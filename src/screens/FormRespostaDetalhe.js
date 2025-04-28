import React from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Button, Share } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function FormRespostaDetalhe() {
  const route = useRoute();
  const navigation = useNavigation();
  const { resposta, chave } = route.params ?? {};

  if (!resposta) {
    return (
      <View style={styles.container}>
        <Text style={styles.titulo}>❌ Nenhuma resposta encontrada.</Text>
      </View>
    );
  }

  const excluirResposta = async () => {
    try {
      if (!chave) throw new Error('Chave de resposta ausente');

      await AsyncStorage.removeItem(chave);
      Alert.alert('Sucesso', 'Formulário excluído com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao excluir:', error);
      Alert.alert('Erro', 'Não foi possível excluir.');
    }
  };

  const gerarPDF = async () => {
    try {
      if (!resposta || !resposta.respostas || typeof resposta.respostas !== 'object') {
        console.warn('❌ Dados de resposta inválidos para gerar PDF:', resposta);
        Alert.alert('Erro', 'Os dados do formulário estão incompletos ou mal formatados.');
        return;
      }

      const html = `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                padding: 20px;
              }
              h1 {
                text-align: center;
                color: #004f9f;
              }
              .info {
                margin-bottom: 20px;
                font-size: 14px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 14px;
              }
              th, td {
                border: 1px solid #ccc;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f0f0f0;
              }
            </style>
          </head>
          <body>
            <h1>${resposta.titulo || 'Formulário'}</h1>
            <div class="info">
              <strong>Preenchido em:</strong> ${resposta.preenchidoEm || '---'}
            </div>
            <table>
              <thead>
                <tr>
                  <th>Campo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                ${Object.entries(resposta.respostas).map(
        ([campo, valor]) => `
                    <tr>
                      <td>${campo}</td>
                      <td>${String(valor)}</td>
                    </tr>
                  `
      ).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      const options = {
        html,
        fileName: `formulario_${resposta.idFormulario || 'resposta'}`,
        directory: 'Documents',
      };

      const file = await RNHTMLtoPDF.convert(options);

      await Share.share({
        url: file.filePath,
        title: 'Formulário em PDF',
        message: `Confira o formulário gerado em PDF:`,
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      Alert.alert('Erro', 'Não foi possível gerar o PDF.');
    }
  };


  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>{resposta.titulo}</Text>
      <Text style={styles.data}>Preenchido em: {resposta.preenchidoEm}</Text>

      {Object.entries(resposta.respostas).map(([chave, valor]) => (
        <View key={chave} style={styles.item}>
          <Text style={styles.campo}>{chave}:</Text>
          <Text style={styles.valor}>{String(valor)}</Text>
        </View>
      ))}
      <View style={styles.botoesContainer}>
        <Button title="🗑️ Excluir formulário" color="#b00020" onPress={excluirResposta} />
        <View style={{ height: 12 }} />
        <Button title="📄 Exportar como PDF" onPress={gerarPDF} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  data: { fontSize: 14, color: '#666', marginBottom: 20 },
  item: { marginBottom: 12 },
  campo: { fontWeight: '600', fontSize: 15 },
  valor: { fontSize: 15, color: '#333' },
  botoesContainer: { marginTop: 24, marginBottom: 40 },
});
