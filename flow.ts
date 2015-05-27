interface Modifier<T> {
    (data: T): boolean;
}

interface FilterFn<T> {
    (data: T): boolean;
}

interface MapFn<A, B> {
    (data: A): B;
}

interface ReduceFn<R, A> {
    (prev: R, data: A): R;
}

export function filter<T> (
        out: Modifier<T>,
        filter_fn: FilterFn<T>): Modifier<T>
    {
    return function(data: T) {
        if (filter_fn(data)) {
            return out(data);
        }
    }
}


export function map<A, B>(out: Modifier<B>, map_fn: MapFn<A, B>): Modifier<A> {
    return function(data: A) {
        return out(map_fn(data))
    }
}

export function dedup<A>(out: Modifier<A>): Modifier<A> {
    var last: A = undefined;
    return function (data: A) {
        // TODO: replace this with _.deep_equals or something
        if (data !== last) {
            last = data;
            return out(data);
        }
    }
}

export function reduce<R, T>(out: Modifier<R>, reduce_fn: ReduceFn<R, T>, initial: R): Modifier<T> {
    return function(data: T) {
        initial = reduce_fn(initial, data);
        return out(initial);
    }
}

export function partition<T>(out1: Modifier<T>, out2: Modifier<T>, partition_fn: FilterFn<T>): Modifier<T> {
    return function(data: T) {
        if (partition_fn(data)) {
            return out1(data);
        } else {
            return out2(data);
        }
    }
}

export function interval(out: Modifier<void>, delta_t: number) {
    var id = setInterval(function () {
        if (out(null)) {
            clearInterval(id);
        }
    }, delta_t);
}

export function interval_value<T>(out: Modifier<T>, delta_t: number, value: T) {
    return interval(map(out, function(v: void) { return value; }), delta_t);
}

export function during<T>(out: Modifier<T>, during_function: FilterFn<T>): Modifier<T> {
    return function(data: T) {
        if (during_function(data)) {
            return out(data);
        } else {
            return true;
        }
    }
}

interval_value(
    reduce(
        during(
            function(a) {console.log(a); return false },
            function(a) { return a < 10 }
        ),
        function(a: number, b: number) { return a + b; },
        0
    ),
    0,
    1.0
)
