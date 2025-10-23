---
description: Set up Vercel AI SDK in Next.js project
---

# Setup Vercel AI SDK

Initialize Vercel AI SDK with provider configuration for your Next.js application.

## Instructions

1. Install Vercel AI SDK and provider packages:
   ```bash
   pnpm add ai @ai-sdk/openai @ai-sdk/anthropic
   ```
2. Ask which AI provider to use:
   - OpenAI (GPT-4, GPT-3.5)
   - Anthropic (Claude)
   - Google (Gemini)
   - Custom provider
3. Set up environment variables in `.env.local`:
   - OPENAI_API_KEY
   - ANTHROPIC_API_KEY
   - Model configuration
4. Create AI client configuration `src/lib/ai.ts`:
   - Configure provider
   - Set default models
   - Add helper functions
5. Create example API route for text generation
6. Create example API route for streaming responses
7. Provide usage examples for:
   - Text generation
   - Streaming responses
   - Chat completions
   - Function calling

## AI Client Example

```typescript
import { createOpenAI } from '@ai-sdk/openai'
import { createAnthropic } from '@ai-sdk/anthropic'

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})
```

Provide complete setup with multiple provider options.
