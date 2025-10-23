---
description: Implement AI function/tool calling with AI SDK
---

# Add Function Calling

Implement function calling (tools) with Vercel AI SDK for structured AI interactions.

## Instructions

1. Ask what functions/tools the AI should be able to call
2. Define tool schemas using Zod:
   - Function name and description
   - Parameters with types
   - Return type
3. Implement tool execution handlers
4. Update AI endpoint to include tools
5. Handle tool calls in streaming responses
6. Create UI to display tool usage
7. Add error handling for tool execution

## Function Calling Example

```typescript
import { openai } from '@ai-sdk/openai'
import { generateText, tool } from 'ai'
import { z } from 'zod'

const result = await generateText({
  model: openai('gpt-4-turbo'),
  tools: {
    weather: tool({
      description: 'Get the weather in a location',
      parameters: z.object({
        location: z.string().describe('The location to get weather for'),
      }),
      execute: async ({ location }) => {
        // Fetch weather data
        return { temperature: 72, condition: 'sunny' }
      },
    }),
    search: tool({
      description: 'Search the web',
      parameters: z.object({
        query: z.string(),
      }),
      execute: async ({ query }) => {
        // Perform search
        return { results: [] }
      },
    }),
  },
  prompt: 'What is the weather in San Francisco?',
})
```

Ensure type-safe tool definitions and proper error handling.
