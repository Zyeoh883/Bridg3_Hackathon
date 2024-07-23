export class TimeoutError extends Error {
    constructor(message) {
        super(message); // Call the parent class constructor with the message
        this.name = "Timeout Error"; // Set the error name
        Object.setPrototypeOf(this, TimeoutError.prototype); // Maintain proper prototype chain
    }
}
export function withTimeout(asyncFunc, timeout) {
    return function (...args) {
        return Promise.race([
            asyncFunc(...args),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Operation timed out')), timeout))
        ]);
    };
}
export function createAsyncIterableWithTimeout(iterable, timeout) {
    return {
        [Symbol.asyncIterator]() {
            const iterator = iterable[Symbol.asyncIterator]();
            return {
                async next() {
                    return Promise.race([
                        iterator.next(),
                        new Promise((_, reject) => setTimeout(() => reject(new TimeoutError('Operation timed out')), timeout))
                    ]);
                }
            };
        }
    };
}
