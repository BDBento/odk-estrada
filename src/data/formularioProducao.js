const formularioProducao = {
  id: 1,
  titulo: "Formulário de Produção",
  campos: [
    { id: "data", label: "Data", tipo: "data" },
    { id: "hora", label: "Hora", tipo: "hora" },

    {
      id: "tipo_servico",
      label: "Tipo de Serviço",
      tipo: "selecao",
      opcoes: ["Terraplenagem", "Pavimentação", "Acesso Externo"]
    },
    {
      id: "lado",
      label: "Lado",
      tipo: "selecao",
      opcoes: ["Direito", "Esquerdo", "Centro"]
    },
    {
      id: "escavadeira",
      label: "Escavadeira",
      tipo: "selecao",
      opcoes: ["EHT0840", "EHT1031", "EHT1063", "EHT4139"]
    },
    {
      id: "prefixo_cb",
      label: "Prefixo CB",
      tipo: "selecao",
      opcoes: [
        "BUR9503", "QMZ8A71", "EWJ2B39", "FHD5H68", "QMZ8A28",
        "QMZ8A18", "IFC6050", "ANT1831", "QMZ7I52", "HNT8H87", "QMZ7J90"
      ]
    },
    {
      id: "origem_mat",
      label: "Origem Material",
      tipo: "selecao",
      opcoes: ["CORTE", "CX EMP", "REBAIXO", "CASCALHEIRA", "BOTA DENTRO"]
    },
    {
      id: "origem_est_inicial",
      label: "Origem Est. Inicial",
      tipo: "numero",
      validacao: { min: 0, max: 695 }
    },
    {
      id: "origem_est_final",
      label: "Origem Est. Final",
      tipo: "numero",
      validacao: { min: 0, max: 695 }
    },
    {
      id: "servico_destino",
      label: "Serviço Destino",
      tipo: "selecao",
      opcoes: ["ATERRO", "BOTA FORA", "SUB-BASE", "BASE", "CASCALHO ATERRO", "DESVIO"]
    },
    {
      id: "destino_est_inicial",
      label: "Destino Est. Inicial",
      tipo: "numero",
      validacao: { min: 0, max: 695 }
    },
    {
      id: "destino_est_final",
      label: "Destino Est. Final",
      tipo: "numero",
      validacao: { min: 0, max: 695 }
    },
    {
      id: "material",
      label: "Tipo de Material",
      tipo: "selecao",
      opcoes: ["MAT 1ª CAT", "CASCALHO", "AREIA", "PEDRA"]
    },
    {
      id: "observacao",
      label: "Observação",
      tipo: "selecao",
      opcoes: ["1 CFT", "2 CFT", "3 CFT", "BOTA DENTRO"]
    }
  ]
};

export default formularioProducao;
