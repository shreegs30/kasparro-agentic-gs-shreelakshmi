import { Pipeline } from './orchestrator/Pipeline';

const testData = {
  product_name: "GlowBoost Vitamin C Serum",
  concentration: "10% Vitamin C",
  skin_type: ["Oily", "Combination"],
  key_ingredients: ["Vitamin C", "Hyaluronic Acid"],
  benefits: ["Brightening", "Fades dark spots"],
  how_to_use: "Apply 2–3 drops in the morning before sunscreen",
  side_effects: "Mild tingling for sensitive skin",
  price: "₹699"
};

async function runTest() {
  console.log("Starting Pipeline...");
  const pipeline = new Pipeline(testData, (step, data) => {
    console.log(`Step: ${step}`, data);
  });

  const result = await pipeline.execute();
  console.log("Pipeline completed. Result:", result);
}

runTest().catch(console.error);