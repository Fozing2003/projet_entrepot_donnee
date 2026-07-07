export function extractYear(question: string): number | undefined {

    const match = question.match(/\b(19|20)\d{2}\b/);

    if (!match) return undefined;

    return parseInt(match[0], 10);

}