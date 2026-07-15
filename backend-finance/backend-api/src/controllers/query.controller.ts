import { Request, Response } from "express";
import { QueryTranslator } from "../ai/queryTranslator";
import { CubeService } from "../services/cube.service";

const translator = new QueryTranslator();
const cube = new CubeService();

export async function query(req: Request, res: Response) {

    try {

        const { question } = req.body;

        if (typeof question !== "string" || !question.trim()) {
            return res.status(400).json({
                error: "La question est obligatoire"
            });
        }

        const cubeQuery = await translator.translate(question);

        const data = await cube.execute(cubeQuery);

        res.json({
            question: question.trim(),
            cubeQuery,
            data
        });

    } catch (error) {

        const message = error instanceof Error ? error.message : "Unable to process query";

        console.error(message);

        res.status(500).json({
            error: message
        });

    }

}
