export class TimeoutError extends Error {
  constructor(message: string) {
    super(message); // Call the parent class constructor with the message
    this.name = "Timeout Error"; // Set the error name
    Object.setPrototypeOf(this, TimeoutError.prototype); // Maintain proper prototype chain
  }
}


export function withTimeout<T>(
	asyncFunc: (...args: any[]) => Promise<T>,
	timeout: number
): (...args: any[]) => Promise<T> {
	return function(...args: any[]): Promise<T> {
		return Promise.race([
			asyncFunc(...args),
			new Promise<T>((_, reject) =>
				setTimeout(() => reject(new Error('Operation timed out')), timeout)
		)
	]);
};
}

export function createAsyncIterableWithTimeout<T>(
	iterable: AsyncIterable<T>,
	timeout: number
): AsyncIterable<T> {
	return {
		[Symbol.asyncIterator](): AsyncIterator<T> {
			const iterator = iterable[Symbol.asyncIterator]();
			return {
				async next() {
					return Promise.race([
						iterator.next(),
						new Promise<IteratorResult<T>>((_, reject) =>
							setTimeout(() => reject(new TimeoutError('Operation timed out')), timeout)
					)
				]);
			}
		};
	}
};
}