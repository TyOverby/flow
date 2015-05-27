function filter(out, filter_fn) {
    return function (data) {
        if (filter_fn(data)) {
            return out(data);
        }
    };
}
exports.filter = filter;
function map(out, map_fn) {
    return function (data) {
        return out(map_fn(data));
    };
}
exports.map = map;
function dedup(out) {
    var last = undefined;
    return function (data) {
        // TODO: replace this with _.deep_equals or something
        if (data !== last) {
            last = data;
            return out(data);
        }
    };
}
exports.dedup = dedup;
function reduce(out, reduce_fn, initial) {
    return function (data) {
        initial = reduce_fn(initial, data);
        return out(initial);
    };
}
exports.reduce = reduce;
function partition(out1, out2, partition_fn) {
    return function (data) {
        if (partition_fn(data)) {
            return out1(data);
        }
        else {
            return out2(data);
        }
    };
}
exports.partition = partition;
function interval(out, delta_t) {
    var id = setInterval(function () {
        if (out(null)) {
            clearInterval(id);
        }
    }, delta_t);
}
exports.interval = interval;
function interval_value(out, delta_t, value) {
    return interval(map(out, function (v) { return value; }), delta_t);
}
exports.interval_value = interval_value;
function during(out, during_function) {
    return function (data) {
        if (during_function(data)) {
            return out(data);
        }
        else {
            return true;
        }
    };
}
exports.during = during;
interval_value(reduce(during(function (a) { console.log(a); return false; }, function (a) { return a < 10; }), function (a, b) { return a + b; }, 0), 0, 1.0);
