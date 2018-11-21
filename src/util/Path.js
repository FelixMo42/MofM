function open(map, x, y, mode) {
    var tile = map.Tile(x, y)
    if (tile) {
        return tile.Walkable()
    } else {
        return false
    }
}

function find(map, startPos, endPos, mode) {
    var open = {}
    var closed = {}

    var sx = startPos[0]
    var sy = startPos[1]
    var ex = endPos[0]
    var ey = endPos[1]

    add(open, {
        x: sx, y: sy,
        s: 0,
        t: dist(sx, sy, ex, ey)
    })

    while (true) {
        var current = false

        for (var node in open) {
            if (!current || current.t > open[node].t) {
                current = open[node]
            }
        }

        if (!current) { break; }

        remove(open, current.x, current.y)
        add(closed, current)

        if (get(closed , ex , ey)) { break; }

        addNeighbours(map, open, closed, current, ex, ey, mode)
    }

    return calc(map, open, closed, sx, sy, ex, ey, mode)
}

function line(map, sx, sy, ex, ey, mode) {
    var good = true
    var steps = Math.max(Math.abs(sx-ex),Math.abs(sy-ey))
    var x, y, p = 0
    for (var step = 0; step < steps; step++) {
        p = step / steps
        x = Math.floor(sx * (1-p) + ex * p)
	    y = Math.floor(sy * (1-p) + ey * p)
        if (x !== sx && y !== sy) {
            if (!open(map, x, y, mode)) {
                good = false
            }
        }
    }
    return good
}

var sqrts = {}

function sqrt(n) {
    if (!sqrts[n]) {
        sqrts[n] = Math.sqrt(n)
    }
    return sqrts[n]
}

function dist(sx, sy, ex, ey) {
    return sqrt(Math.pow(sx - ex, 2) + Math.pow(sy - ey, 2))
}

function add(l, t) {
	l[t.x + "_" + t.y] = t
}

function get(l, x, y) {
    return l[x + "_" + y]
}

function remove(l, x, y) {
	delete l[x + "_" + y]
}

function addNeighbours(map, o, c, node, ex, ey, mode) {
    var n = []
    var f = node.s + 10

    for (var x = node.x - 1; x <= node.x + 1; x++) {
        for (var y = node.y - 1; y <= node.y + 1; y++) {
            if ((x !== node.x || y !== node.y) && !get(c, x, y)) {
                var d = dist(x,y , ex,ey)
                add(open(map, x, y, mode) && o || c, {
                    x: x, y: y,
                    s: f,
                    d: d,
                    t: d + f,
                    p: node,
                })
            }
        }
    }

    return n
}

function calc(map, o, c, sx, sy, ex, ey, mode) {
    if (!get(c, ex, ey)) { return []; }

    var prev = get(c, ex, ey)
    var path = []
    while (prev.p) {
        path.push( [prev.x, prev.y] )
        prev = prev.p
    }

    path.reverse()

    if (!open(map, ex, ey, mode)) {
        path.pop()
    }

    return path
}

export default {
    find: find,
    line: line,
    dist: dist
}
