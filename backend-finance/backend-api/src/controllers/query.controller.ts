import { Request, Response } from "express";
import { QueryTranslator } from "../ai/queryTranslator";
import { CubeService } from "../services/cube.service";

const translator = new QueryTranslator();
const cube = new CubeService();

export async function query(req: Request, res: Response) {

    try {

        const { question } = req.body;

        const cubeQuery = await translator.translate(question);

        const data = await cube.execute(cubeQuery);

        res.json({
            question,
            cubeQuery,
            data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Unable to process query"
        });

    }

}