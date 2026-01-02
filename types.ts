
export interface RawProductData {
  product_name: string;
  concentration: string;
  skin_type: string[];
  key_ingredients: string[];
  benefits: string[];
  how_to_use: string;
  side_effects: string;
  price: string;
}

export interface NormalizedProduct {
  id: string;
  name: string;
  specs: {
    concentration: string;
    skinTypes: string[];
    ingredients: string[];
  };
  features: {
    benefits: string[];
    usage: string;
    precautions: string;
  };
  pricing: {
    amount: string;
    currency: string;
  };
}

export enum QuestionCategory {
  INFORMATIONAL = 'informational',
  USAGE = 'usage',
  SAFETY = 'safety',
  PURCHASE = 'purchase',
  COMPARISON = 'comparison'
}

export interface CategorizedQuestion {
  category: QuestionCategory;
  question: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface ProductPageContent {
  header: any;
  details: any;
  instructions: any;
  safety: any;
}

export interface ComparisonData {
  productA: NormalizedProduct;
  productB: {
    name: string;
    concentration: string;
    price: string;
    key_ingredients: string[];
  };
  comparisonPoints: Array<{
    feature: string;
    productAValue: string;
    productBValue: string;
    winner?: string;
  }>;
}

export interface PipelineState {
  raw: RawProductData;
  normalized?: NormalizedProduct;
  questions?: CategorizedQuestion[];
  faq?: FAQItem[];
  productPage?: ProductPageContent;
  comparison?: ComparisonData;
}
