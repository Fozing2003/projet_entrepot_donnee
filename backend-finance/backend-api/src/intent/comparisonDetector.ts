import { Intent } from "./intent.types";

export class ComparisonDetector {

    detect(question: string, intent: Intent): Intent {

        const lower = question.toLowerCase();

        const comparisonWords = [

            "compare",
            "comparer",
            "comparaison",
            "versus",
            "vs",
            "contre",
            "entre"

        ];

        intent.comparison = comparisonWords.some(word =>
            lower.includes(word)
        );

        return intent;

    }

}