/**
 * Removes any keys whose values are undefined in `obj`, returning `undefined`
 * if there are no more keys in the object after doing so.
 */
export function cleanObject<T extends Record<string, any>>(obj: T): T | undefined {
    const keys = Object.keys(obj);

    for (const key of keys) {
        if (obj[key] === undefined) {
            delete obj[key];
        }
    }

    if (Object.keys(obj).length === 0) {
        return;
    }

    return obj;
}
