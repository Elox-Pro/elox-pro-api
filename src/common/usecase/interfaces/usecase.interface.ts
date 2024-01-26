export interface IUseCase<T, R> {
    execute(data: T): Promise<R>;
}