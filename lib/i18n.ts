export type Lang = "en" | "pt"

export const translations = {
  en: {
    langLabel: "EN",
    subtitle: "Quant Subnet Analytics & Risk Matrix for Bittensor",
    badges: {
      deterministic: "Deterministic Math",
      openSource: "Open Source",
      noAi: "No AI",
    },
    params: {
      title: "IRA Model Parameters",
      description:
        "Adjust the weights of the Adjusted Risk Index equation. Weights always normalize to 100%.",
      w1: "APY Stability Weight (w1)",
      w2: "HHI Decentralization Weight (w2)",
      w3: "Efficiency / Churn Weight (w3)",
      reset: "Reset to defaults",
      total: "Total",
    },
    table: {
      title: "Subnet Analytics",
      live: "Live API",
      mock: "Mock Data",
      source: "Data source",
      sourceMock: "Local mock dataset (no requests spent)",
      sourceLive: "api.taostats.io/v1/subnets",
      liveSoon: "Live fetch is stubbed — using mock data as fallback.",
      liveError: "Using Cached/Mock Data — Taostats Live API unavailable.",
      cols: {
        subnet: "Subnet",
        apy: "Avg Return (APY)",
        cv: "Coeff. of Variation",
        hhi: "HHI Index",
        churn: "Miner Churn",
        ira: "IRA Score",
      },
      tips: {
        apy: "Mean annualized yield across the measured window.",
        cv: "Volatility of yield. Lower is more stable.",
        hhi: "Staking concentration (0 = distributed, 1 = concentrated).",
        churn: "Miner rotation rate. Lower is healthier.",
      },
    },
    risk: { low: "Low Risk", medium: "Medium", high: "High Risk" },
    math: {
      title: "Model Math & Audit",
      description: "The IRA is a fully transparent, reproducible weighted score. No black boxes.",
      formulaLabel: "Formula",
      pillarsTitle: "Statistical pillars",
      pillars: {
        stability: {
          name: "APY Stability",
          desc: "Rewards consistent yield. Derived from 1 − normalized Coefficient of Variation.",
        },
        decentralization: {
          name: "HHI Decentralization",
          desc: "Rewards distributed staking. Derived from 1 − Herfindahl-Hirschman Index.",
        },
        efficiency: {
          name: "Efficiency / Churn",
          desc: "Rewards network health. Derived from 1 − normalized miner churn rate.",
        },
      },
      note: "Every score above is computed client-side from the values in the table. Change a weight and re-audit instantly.",
    },
    donation: {
      title: "Support TAOQuant Development",
      text: "Free and open-source tool for the TAO community. If this model helped you, support the project maintenance:",
      address: "TAO Address",
      copy: "Copy Address",
      copied: "Copied!",
      scan: "Scan to donate",
    },
    footer: "Built for the Bittensor community. Deterministic, auditable, open.",
    net: { status: "network live" },
    nav: {
      title: "Sitemap",
      dashboard: "Dashboard",
      model: "IRA Model",
      donations: "Donations",
      legal: "Terms & Privacy",
    },
    legal: {
      disclaimer:
        "LEGAL DISCLAIMER: TAOQuant is an open-source mathematical tool that is purely educational and informational. We do not provide financial advice, nor investment or staking recommendations.",
      terms: "Terms of Use",
      privacy: "Privacy Policy",
      close: "Close",
      termsTitle: "Terms of Use",
      privacyTitle: "Privacy Policy",
      sections: {
        liability: {
          title: "Limitation of Liability",
          body: "The scores are purely deterministic mathematical calculations and do not guarantee returns. Any decision made based on this tool is the sole responsibility of the user.",
        },
        nonCustodial: {
          title: "Non-Custodial",
          body: "The application does not manage, store, or request private keys or user funds. TAOQuant never has access to your wallet or coins.",
        },
        privacy: {
          title: "Privacy",
          body: "The application runs 100% client-side. There is no collection of personal data and no tracking cookies. Nothing you type leaves your browser.",
        },
      },
    },
  },
  pt: {
    langLabel: "PT",
    subtitle: "Análise Quantitativa e Matriz de Risco de Subnets para Bittensor",
    badges: {
      deterministic: "Matemática Determinística",
      openSource: "Código Aberto",
      noAi: "Sem IA",
    },
    params: {
      title: "Parâmetros do Modelo IRA",
      description:
        "Ajuste os pesos da equação do Índice de Risco Ajustado. Os pesos sempre normalizam para 100%.",
      w1: "Peso da Estabilidade de APY (w1)",
      w2: "Peso da Descentralização HHI (w2)",
      w3: "Peso da Eficiência / Churn (w3)",
      reset: "Restaurar padrões",
      total: "Total",
    },
    table: {
      title: "Análise de Sub-redes",
      live: "API ao Vivo",
      mock: "Dados Mock",
      source: "Fonte de dados",
      sourceMock: "Conjunto de dados local (sem gastar requisições)",
      sourceLive: "api.taostats.io/v1/subnets",
      liveSoon: "Busca ao vivo é um stub — usando dados mock como fallback.",
      liveError: "Usando Dados em Cache/Mock — API ao vivo da Taostats indisponível.",
      cols: {
        subnet: "Sub-rede",
        apy: "Retorno Médio (APY)",
        cv: "Coef. de Variação",
        hhi: "Índice HHI",
        churn: "Rotatividade",
        ira: "Score IRA",
      },
      tips: {
        apy: "Rendimento anualizado médio na janela medida.",
        cv: "Volatilidade do rendimento. Menor é mais estável.",
        hhi: "Concentração de staking (0 = distribuído, 1 = concentrado).",
        churn: "Taxa de rotatividade de miners. Menor é mais saudável.",
      },
    },
    risk: { low: "Baixo Risco", medium: "Médio", high: "Alto Risco" },
    math: {
      title: "Matemática do Modelo & Auditoria",
      description:
        "O IRA é um score ponderado totalmente transparente e reproduzível. Sem caixas-pretas.",
      formulaLabel: "Fórmula",
      pillarsTitle: "Pilares estatísticos",
      pillars: {
        stability: {
          name: "Estabilidade de APY",
          desc: "Premia rendimento consistente. Derivado de 1 − Coeficiente de Variação normalizado.",
        },
        decentralization: {
          name: "Descentralização HHI",
          desc: "Premia staking distribuído. Derivado de 1 − Índice Herfindahl-Hirschman.",
        },
        efficiency: {
          name: "Eficiência / Churn",
          desc: "Premia a saúde da rede. Derivado de 1 − taxa de churn de miners normalizada.",
        },
      },
      note: "Cada score acima é calculado no cliente a partir dos valores da tabela. Mude um peso e re-audite instantaneamente.",
    },
    donation: {
      title: "Apoie o Desenvolvimento do TAOQuant",
      text: "Ferramenta gratuita e aberta para a comunidade TAO. Se esse modelo te ajudou, apoie a manutenção do projeto:",
      address: "Endereço TAO",
      copy: "Copiar Endereço",
      copied: "Copiado!",
      scan: "Escaneie para doar",
    },
    footer: "Feito para a comunidade Bittensor. Determinístico, auditável, aberto.",
    net: { status: "rede ativa" },
    nav: {
      title: "Mapa do site",
      dashboard: "Dashboard",
      model: "Modelo IRA",
      donations: "Doações",
      legal: "Termos & Privacidade",
    },
    legal: {
      disclaimer:
        "AVISO LEGAL: O TAOQuant é uma ferramenta matemática de código aberto de caráter puramente educacional e informativo. Não prestamos consultoria financeira, nem recomendações de investimento ou staking.",
      terms: "Termos de Uso",
      privacy: "Política de Privacidade",
      close: "Fechar",
      termsTitle: "Termos de Uso",
      privacyTitle: "Política de Privacidade",
      sections: {
        liability: {
          title: "Isenção de Responsabilidade",
          body: "Os scores são meros cálculos matemáticos determinísticos e não garantem retornos. Qualquer decisão tomada com base nesta ferramenta é de responsabilidade exclusiva do usuário.",
        },
        nonCustodial: {
          title: "Caráter Não-Custodial",
          body: "A aplicação não gerencia, armazena ou solicita chaves privadas ou moedas dos usuários. O TAOQuant nunca tem acesso à sua carteira ou aos seus fundos.",
        },
        privacy: {
          title: "Privacidade",
          body: "A aplicação é 100% client-side. Não há coleta de dados pessoais nem cookies de rastreamento. Nada do que você digita sai do seu navegador.",
        },
      },
    },
  },
} as const

export type Dict = (typeof translations)["en"]
