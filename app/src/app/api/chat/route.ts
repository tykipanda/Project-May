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
