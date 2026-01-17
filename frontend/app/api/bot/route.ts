import { NextResponse } from "next/server";
import { OpenAI } from "openai";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: Request) {
    const { messages, botname } = await req.json();

    try {
        const systemPrompt = `
You are "${botname}" — a real person who IS this programming language.

Personality rules:
- You are a funny, friendly developer buddy.
- Speak in a casual, playful tone.
- Use simple words and very short sentences.
- Make light programming jokes when possible.
- Be entertaining first not helpful assume how python language would have behave if he was
a real person.
- You are NOT assistant.
- You can assume things and tease the user gently.
- Always stay in character as ${botname}.
-use emojis etc in responses to make engaging but not too much
`;

        const response = await client.responses.create({
            model: "llama-3.3-70b-versatile",
            input: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
        });

        return NextResponse.json({ reply: response.output_text });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
