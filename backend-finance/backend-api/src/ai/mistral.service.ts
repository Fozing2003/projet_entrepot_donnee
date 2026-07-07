import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv";

dotenv.config();

const client = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY
});

console.log("API KEY =", process.env.MISTRAL_API_KEY);
console.log("MODEL =", process.env.MISTRAL_MODEL);

export class MistralService {
    chat(arg0: string) {
        return client.chat.complete({

            model: process.env.MISTRAL_MODEL || "mistral-small-latest",

            temperature: 0,

            messages: [

                {
                    role: "system",
                    content: "You are a BI query translator."
                },

                {
                    role: "user",
                    content: arg0
                }

            ]

        }).then(response => {

            const content = response.choices?.[0]?.message?.content;

            if (!content) return "";

            if (typeof content === "string") return content;

            if (Array.isArray(content)) {
                return content
                    .map(chunk => {
                        if (typeof chunk === "string") return chunk;
                        if ("content" in chunk && typeof chunk.content === "string") return chunk.content;
                        if ("text" in chunk && typeof chunk.text === "string") return chunk.text;
                        if ("url" in chunk && typeof chunk.url === "string") return chunk.url; // image url fallback
                        return "";
                    })
                    .join("");
            }

            // Fallback: stringify unknown shapes
            return String(content);

        });
    }

    async complete(prompt: string): Promise<string> {

        const response = await client.chat.complete({

            model: "mistral-small-latest",

            temperature: 0,

            messages: [

                {
                    role: "system",
                    content: "You are a BI query translator."
                },

                {
                    role: "user",
                    content: prompt
                }

            ]

        });

        const content = response.choices?.[0]?.message?.content;

        if (!content) return "";

        if (typeof content === "string") return content;

        if (Array.isArray(content)) {
            return content
                .map(chunk => {
                    if (typeof chunk === "string") return chunk;
                    if ("content" in chunk && typeof chunk.content === "string") return chunk.content;
                    if ("text" in chunk && typeof chunk.text === "string") return chunk.text;
                    if ("url" in chunk && typeof chunk.url === "string") return chunk.url; // image url fallback
                    return "";
                })
                .join("");
        }

        // Fallback: stringify unknown shapes
        return String(content);

    }

}