export type BotResponse = {
    text: string;
    keyboard?: any;
};

export function sanitizeInput(input: string) {
    return input.replace(/[*_`]/g, "").trim();
}

export function isTooGeneric(input: string) {
    return !input || input.length < 3;
}