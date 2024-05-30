export interface Translator<T, K> {
    translate(model: T, lang: string): Promise<K>;
}