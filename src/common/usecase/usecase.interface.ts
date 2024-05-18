export interface IUseCase<T, R> {
    execute(request: T): Promise<R>;
}