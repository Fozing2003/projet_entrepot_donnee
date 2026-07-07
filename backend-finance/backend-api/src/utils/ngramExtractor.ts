export function generateNGrams(words: string[]): string[] {

    const grams: string[] = [];

    for (let i = 0; i < words.length; i++) {

        grams.push(words[i]);

        if (i + 1 < words.length) {

            grams.push(
                words[i] + " " + words[i + 1]
            );

        }

        if (i + 2 < words.length) {

            grams.push(
                words[i]
                + " "
                + words[i + 1]
                + " "
                + words[i + 2]
            );

        }

    }

    return [...new Set(grams)];

}