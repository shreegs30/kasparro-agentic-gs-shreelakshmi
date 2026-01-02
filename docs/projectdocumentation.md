
# Kasparro AI Agentic Content Generation System

## Problem Statement
Traditional content generation often relies on monolithic prompts that are prone to hallucination, inconsistent formatting, and loss of critical product facts. This system aims to solve these issues by breaking down the content lifecycle into discrete, specialized agent tasks coordinated by a central orchestration layer.

## Solution Overview
We have implemented a modular, multi-agent system that transforms raw product datasets into multiple machine-readable JSON documents (FAQ, Product Page, Comparison). The solution leverages structured logic blocks and a custom template engine to ensure that the output remains strictly tied to the provided input source of truth while still benefiting from AI-driven creative reasoning for tasks like question generation and competitor simulation.

This system uses an event-driven agentic architecture. Agents are autonomous, react to domain events via a shared EventBus, and publish new events without direct coupling or static control flow.

## Scope & Assumptions
- **Scope**: Automated generation of structured content (JSON) for e-commerce products.
- **Assumptions**: 
    - The input dataset is the "Only Source of Truth".
    - Fictional competitors (Product B) do not use real-world brand names.
    - Output is exclusively machine-readable JSON.
    - System assumes a valid Gemini API key is available via environment variables.

## System Design

### Agent Responsibilities
- **DataParserAgent**: Normalizes raw, unstructured input into a standard Internal Product Model.
- **QuestionGenerationAgent**: Brainstorms a minimum of 15 categorized questions using the LLM to cover all aspects of the product lifecycle.
- **FAQAgent**: Uses Logic Blocks and the FAQ Template to synthesize high-quality Q&A pairs.
- **ProductPageAgent**: Orchestrates Logic Blocks (ingredients, usage, safety) to build a layout-ready JSON model.
- **ComparisonAgent**: Dynamically creates a fictional competitor and generates a point-by-point comparison matrix.

### Logic Blocks
Independent modules that process specific facets of a product:
- `benefits_block`: Summarizes product impact.
- `usage_block`: Converts usage strings into step-by-step instructions.
- `safety_block`: Highlights side effects and precautions.
- `pricing_block`: Formats and values pricing data.
- `ingredients_block`: Categorizes active vs passive ingredients.
- `comparison_block`: Structures comparative data between two products.

### Custom Template Engine
A mandatory validation and formatting layer that:
- Defines required schema fields.
- Formats logic block outputs into a finalized layout model.
- Ensures consistency across multiple product runs.

### Orchestration Flow
1. **Raw Data** is ingested.
2. **DataParserAgent** creates the internal model.
3. **QuestionGenerationAgent** identifies user intent.
4. **Execution Layer**: Concurrent execution of **FAQAgent**, **ProductPageAgent**, and **ComparisonAgent**.
5. **Output**: Aggregation of finalized JSON files.
