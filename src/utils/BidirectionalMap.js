export class BidirectionalMap {
    constructor(initPairs) {
        if (typeof initPairs !== "object" || initPairs === null) {
            throw new Error("The parameter is not an object.");
        }

        this.forwardMap = new Map();
        this.backwardMap = new Map();

        for (let [key, value] of Object.entries(initPairs)) {
            if (this.forwardMap.has(key) || this.backwardMap.has(value)) {
                throw new Error("The key or value already exists in the bidirectional map.");
            }

            this.forwardMap.set(key, value);
            this.backwardMap.set(value, key);
        }
    }

    hasKey(key) {
        return this.forwardMap.has(key);
    }

    hasValue(value) {
        return this.backwardMap.has(value);
    }

    getValue(key) {
        return this.forwardMap.get(key);
    }

    getKey(value) {
        return this.backwardMap.get(value);
    }

    set(key, value) {
        if (this.forwardMap.has(key) || this.backwardMap.has(value)) {
            throw new Error("The key or value already exists in the bidirectional map.");
        }

        this.forwardMap.set(key, value);
        this.backwardMap.set(value, key);
    }

    deleteByKey(key) {
        if (this.forwardMap.has(key)) {
            const value = this.forwardMap.get(key);
            this.forwardMap.delete(key);
            this.backwardMap.delete(value);
        }
    }

    deleteByValue(value) {
        if (this.backwardMap.has(value)) {
            const key = this.backwardMap.get(value);
            this.backwardMap.delete(value);
            this.forwardMap.delete(key);
        }
    }

    clear() {
        this.forwardMap.clear();
        this.backwardMap.clear();
    }

    get size() {
        return this.forwardMap.size;
    }

    [Symbol.iterator]() {
        return this.forwardMap[Symbol.iterator]();
    }
}
