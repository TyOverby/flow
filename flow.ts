interface StreamModifier<A, B> {
    (data: A, send: (B) => boolean): boolean
}

function map<A, B>(fn: (A) => B): StreamModifier<A, B> {
    return function(data: A, send: (B) => boolean): boolean {
        return send(fn(data));
    };
}

function reduce<A>(fn: (A) => boolean): StreamModifier<A, A> {
    return function(data: A, send: (A) => boolean): boolean {
        if (fn(data)) {
            return send(data);
        } else {
            return true;
        }
    }
}

function dedupe<A>(initial?: A): StreamModifier<A, A> {
    return function(data: A, send: (A) => boolean): boolean {
        if (data !== initial) {
            initial = data;
            return send(data);
        } else {
            return true;
        }
    }
}

function apply<A, R>(fn: (R, A) => R, initial: R): StreamModifier<A, R> {
    return function(data: A, send: (R) => boolean): boolean {
        initial = fn(initial, data);
        return send(initial);
    }
}
