
# Kasparro AI Agentic Content Generation System

A production-grade multi-agent system for automated content generation.

## Folder Structure
- `agents/`: Individual agent classes with single responsibilities.
- `blocks/`: Reusable, deterministic logic blocks for content chunks.
- `templates/`: Custom template engine and definitions.
- `orchestrator/`: Central pipeline for agent communication and flow.
- `services/`: API wrappers (Gemini).
- `docs/`: Comprehensive project documentation.

## Getting Started
1. Install dependencies: `npm install`
2. Set up environment: Copy `.env.example` to `.env` and add your `VITE_GEMINI_API_KEY`.
3. Start the React application: `npm run dev`
4. Use the Dashboard to input raw JSON and click "Start Pipeline".
5. Review generated JSON outputs in the side panel.

## Key Constraints
- No monolithic scripts.
- No external facts.
- Every step is an agent or logic block.
- Pure JSON output.
