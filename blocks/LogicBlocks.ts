
import { NormalizedProduct, ComparisonData } from '../types';

export const benefitsBlock = (product: NormalizedProduct) => ({
  title: "Core Benefits",
  items: product.features.benefits.map(b => ({
    label: b,
    impact: "High"
  }))
});

export const usageBlock = (product: NormalizedProduct) => ({
  title: "Application Guide",
  steps: product.features.usage.split('.').filter(s => s.trim()).map((s, i) => ({
    step: i + 1,
    instruction: s.trim()
  }))
});

export const safetyBlock = (product: NormalizedProduct) => ({
  title: "Safety & Precautions",
  warnings: [
    { type: "Side Effects", content: product.features.precautions },
    { type: "Patch Test", content: "Always recommended before full application." }
  ]
});

export const pricingBlock = (product: NormalizedProduct) => ({
  title: "Pricing Details",
  formattedPrice: `${product.pricing.currency}${product.pricing.amount}`,
  valueProp: "Premium quality at accessible pricing."
});

export const ingredientsBlock = (product: NormalizedProduct) => ({
  title: "Key Ingredients",
  list: product.specs.ingredients.map(ing => ({
    name: ing,
    role: ing.toLowerCase().includes('acid') ? 'Hydrator' : 'Active'
  }))
});

export const comparisonBlock = (data: ComparisonData) => ({
  title: `How ${data.productA.name} Stands Out`,
  matrix: data.comparisonPoints
});
