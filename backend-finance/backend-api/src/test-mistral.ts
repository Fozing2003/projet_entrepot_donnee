import "dotenv/config";
import { MistralService } from "./ai/mistral.service";

async function main() {

    const ai = new MistralService();

    const answer = await ai.chat(

        "Réponds uniquement par le mot OK"

    );

    console.log(answer);

}

main();