export function extractLimit(question: string): number | undefined {

    const match = question.match(/\b\d+\b/);

    if (!match) return undefined;

    return parseInt(match[0], 10);

}