export interface Translator<T> {
    translate(entity: T, lang: string): Promise<Map<string, string>>;
}