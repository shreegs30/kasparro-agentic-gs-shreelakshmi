
import { Type } from '@google/genai';

export interface TemplateDefinition {
  name: string;
  requiredFields: string[];
  formatter: (data: any) => any;
}

export class TemplateEngine {
  private templates: Map<string, TemplateDefinition> = new Map();

  register(template: TemplateDefinition) {
    this.templates.set(template.name, template);
  }

  render(templateName: string, data: any) {
    const template = this.templates.get(templateName);
    if (!template) throw new Error(`Template ${templateName} not found`);

    // Validation
    for (const field of template.requiredFields) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field} for template ${templateName}`);
      }
    }

    return template.formatter(data);
  }
}

// Pre-defined Templates
export const FAQTemplate: TemplateDefinition = {
  name: 'FAQ',
  requiredFields: ['items'],
  formatter: (data) => ({
    metadata: {
      generatedAt: new Date().toISOString(),
      type: "FAQ_COLLECTION"
    },
    content: data.items.map((item: any) => ({
      q: item.question,
      a: item.answer
    }))
  })
};

export const ProductPageTemplate: TemplateDefinition = {
  name: 'ProductPage',
  requiredFields: ['header', 'details', 'instructions', 'safety'],
  formatter: (data) => ({
    layout: "modern-v1",
    sections: [
      { id: "hero", data: data.header },
      { id: "ingredients", data: data.details },
      { id: "how-to-use", data: data.instructions },
      { id: "safety", data: data.safety }
    ]
  })
};

export const ComparisonPageTemplate: TemplateDefinition = {
  name: 'ComparisonPage',
  requiredFields: ['comparison'],
  formatter: (data) => ({
    view: "table-comparison",
    data: data.comparison
  })
};
