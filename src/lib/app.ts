export const appMetadata = {
  name: "Abiapay Agent Portal",
  version: "1.0.0",
  description: "A portal for managing Abiapay agent operations.",
  author: "Your Name",
  license: "MIT",
  repository: "https://github.com/yourusername/abiapay-agent-portal",
  homepage: "https://yourhomepage.com",
  banksAllowed: [
    { name: "Access Bank", value: "access", allowed: false },
    { name: "Fidelity Bank", value: "fidelity", allowed: false },
    // Add Hydrogen payment methods
    { name: "Card Payment (POS)", value: "card", allowed: true },
    { name: "BreezePay", value: "breezepay", allowed: true },
    { name: "Transfer/InstantPay", value: "transfer", allowed: true },
  ],
};

export const bankOptions = appMetadata.banksAllowed
  .filter((bank) => bank.allowed)
  .map((bank) => ({
    value: bank.value,
    label: bank.name,
  }));