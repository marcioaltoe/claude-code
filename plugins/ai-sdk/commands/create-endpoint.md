---
description: Create a streaming chat API endpoint with AI SDK
---

# Create Chat Endpoint

Generate a streaming chat API endpoint using Vercel AI SDK.

## Instructions

1. Create API route at `app/api/chat/route.ts`
2. Implement streaming chat endpoint with:
   - AI SDK streamText or generateText
   - Proper provider configuration
   - Message history handling
   - System prompts
   - Error handling
   - Authentication checks
3. Configure streaming response headers
4. Add rate limiting if needed
5. Create client-side chat component using useChat hook
6. Implement UI with:
   - Message list
   - Input field
   - Streaming message display
   - Loading states
   - Error handling

## API Route Example

```typescript
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages,
    system: 'You are a helpful assistant.',
  })

  return result.toDataStreamResponse()
}
```

## Client Component Example

```typescript
'use client'

import { useChat } from 'ai/react'

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat()

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          {m.role}: {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  )
}
```

Provide complete chat implementation with streaming support.
