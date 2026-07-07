import { Mistral } from "@mistralai/mistralai";

export const mistralClient = new Mistral({
    apiKey: process.env.MISTRAL_API_KEY!
});