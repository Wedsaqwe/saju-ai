import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req) {
  try {
    const body = await req.json();
    const { model, max_tokens, system, messages, stream } = body;

    // 스트리밍 모드
    if (stream) {
      const response = await client.messages.create({
        model: model || "claude-sonnet-4-20250514",
        max_tokens: max_tokens || 4000,
        system: system || "",
        messages: messages || [],
        stream: true,
      });

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            for await (const event of response) {
              if (event.type === "content_block_delta" && event.delta?.text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: event.delta.text })}\n\n`));
              }
              if (event.type === "message_stop") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              }
            }
          } catch (e) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: e.message })}\n\n`));
          } finally {
            controller.close();
          }
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // 비스트리밍 (폴백)
    const response = await client.messages.create({
      model: model || "claude-sonnet-4-20250514",
      max_tokens: max_tokens || 4000,
      system: system || "",
      messages: messages || [],
    });

    return Response.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return Response.json(
      { error: error.message || "API 호출 실패" },
      { status: 500 }
    );
  }
}
