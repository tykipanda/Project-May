import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

   // Creamos un ReadableStream para hacer streaming al cliente
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const response = await client.messages.stream({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages,
      });

      for await (const chunk of response) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });
