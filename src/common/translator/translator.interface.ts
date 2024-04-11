export interface Translator<T> {
    translate(model: T, lang: string): Promise<Record<string, string>>;
}