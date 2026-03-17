export async function POST(request) {
  try {
    const body = await request.json();
    
    // messages에 이미지 content block이 포함될 수 있도록 처리
    const messages = (body.messages || []).map(m => {
      // content가 이미 배열인 경우 (이미지 포함) 그대로 전달
      if (Array.isArray(m.content)) {
        return { role: m.role, content: m.content };
      }
      // 문자열인 경우 기본 처리
      return { role: m.role, content: m.content };
    });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: body.model || "claude-sonnet-4-20250514",
        max_tokens: body.max_tokens || 4000,
        system: body.system || "",
        messages: messages,
      }),
    });
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: "API request failed" }, { status: 500 });
  }
}
