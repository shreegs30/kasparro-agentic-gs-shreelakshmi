
/**
 * Local Agent Engine (Keyless Simulator)
 * This replaces external LLM calls with deterministic procedural generation.
 * In a real production environment, this would swap back to the @google/generative-ai SDK.
 */

export const generateJSON = async <T,>(prompt: string, schema: any): Promise<T> => {
  // Simulate network/inference latency
  await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

  const p = prompt.toLowerCase();

  // 1. Logic for QuestionGenerationAgent (15 Questions)
  if (p.includes('15 user questions')) {
    const productName = prompt.match(/"([^"]+)"/)?.[1] || "Product";
    const categories = ['informational', 'usage', 'safety', 'purchase', 'comparison'];
    const result: any[] = [];

    categories.forEach(cat => {
      for (let i = 1; i <= 3; i++) {
        let question = "";
        if (cat === 'informational') question = `How does the active concentration in ${productName} work?`;
        if (cat === 'usage') question = `Can I use ${productName} with other active serums?`;
        if (cat === 'safety') question = `Is ${productName} safe for ultra-sensitive skin?`;
        if (cat === 'purchase') question = `Is ${productName} a good value compared to luxury brands?`;
        if (cat === 'comparison') question = `Why should I choose ${productName} over a standard serum?`;

        result.push({ category: cat, question: `${question} (Ref #${i})` });
      }
    });
    return result as unknown as T;
  }

  // 2. Logic for FAQAgent (Answers)
  if (p.includes('answer these questions')) {
    const questions = prompt.match(/Questions: (.*)/)?.[1]?.split(' | ') || [];
    return questions.map(q => ({
      question: q,
      answer: `Based on the provided specifications, this product is formulated for optimal compatibility. We recommend a patch test before full application as per standard safety protocols.`
    })) as unknown as T;
  }

  // 3. Logic for ComparisonAgent (Competitor Simulation)
  if (p.includes('fictional competitor')) {
    const productName = prompt.match(/"([^"]+)"/)?.[1] || "Current Product";
    return {
      productB: {
        name: "Generic Competitor X",
        concentration: "5% Standard Formula",
        price: "₹1,200",
        key_ingredients: ["Standard Base", "Glycerin"]
      },
      comparisonPoints: [
        { feature: "Active Strength", productAValue: "High (10%)", productBValue: "Low (5%)", winner: productName },
        { feature: "Price", productAValue: "₹699", productBValue: "₹1,200", winner: productName },
        { feature: "Ingredient Purity", productAValue: "Premium", productBValue: "Standard", winner: productName }
      ]
    } as unknown as T;
  }

  return {} as T;
};
