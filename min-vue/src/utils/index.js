export function isObject(obj) {
    return obj !== null && typeof obj === "object"
}

export function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty(obj, key)
}


export function def(obj, key, value,enumerable) {
    Object.defineProperty( obj, key, {
        value,
        enumerable: !!enumerable,
        configurable: true,
        writable: true
    } )
} 