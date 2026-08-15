# taoquant
Deterministic, zero-AI risk analysis dashboard for Bittensor Subnets.
# TAOQuant

TAOQuant is a transparent, deterministic, and non-custodial risk analysis dashboard built for the Bittensor ($TAO) ecosystem. It evaluates subnet health and operational risk without relying on black-box AI models or opaque algorithms.

## 🎯 Key Features

- **IRA Score (Index of Risk Adjustment):** A single metric (0–100) calculated via auditable mathematical formulas.
- **Dynamic Weight Adjustments:** Interactive sliders allowing users to customize risk priorities based on APY stability, HHI decentralization, and miner churn.
- **100% Client-Side:** All calculations run locally in the browser. Zero server-side tracking, zero data collection.
- **Non-Custodial & Safe:** No wallet connection required.

## 🧮 Mathematical Model (IRA Score)

The IRA Score normalizes and weights three core metrics:

1. **APY Stability:** Uses the Coefficient of Variation ($CV$) to penalize yield volatility.
2. **HHI Decentralization:** Measures stake and miner concentration using the Herfindahl-Hirschman Index.
3. **Miner Churn Efficiency:** Tracks turn-over stability across subnets.

All normalization uses clamp constraints to ensure valid scoring between 0 and 100.

## 🚀 Live Demo

- **Website:** [Inserir o link do seu site aqui]

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
