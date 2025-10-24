export type BotResponse = {
    text: string;
    keyboard?: any;
};

export function escapeLike(input: string) {
    return input.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export function sanitizeInput(input: string) {
    if (!input) return "";
    return input.replace(/[*_`]/g, "").trim();
}

export function isTooGeneric(input: string) {
    return !input || input.length < 3;
}