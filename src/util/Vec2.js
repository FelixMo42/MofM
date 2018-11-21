var sqrts = {}

function sqrt(n) {
    if (!sqrts[n]) {
        sqrts[n] = Math.sqrt(n)
    }
    return sqrts[n]
}

export default class Vec2 {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    static dist(a, b) {
        return sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2))
    }

    static forEach(a, b, func) {
        for (var x = a.x; x <= b.x; x++) {
            for (var y = a.y; y <= b.y; y++) {
                func(new Vec2(x, y))
            }
        }
    }
}
