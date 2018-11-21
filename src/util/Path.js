import Vec2 from './Vec2'

function open(map, pos, mode) {
    var tile = map.Tile(pos)
    if (tile) {
        return tile.Walkable(mode)
    } else {
        return false
    }
}

function add(list, node) {
	list[node.pos.x + "_" + node.pos.y] = node
}

function get(list, pos) {
    return list[pos.x + "_" + pos.y]
}

function remove(list, pos) {
	delete list[pos.x + "_" + pos.y]
}

function find(map, start, end, mode) {
    var opened = {}
    var closed = {}

    add(opened, {
        pos: start,
        s: 0,
        t: Vec2.dist(start, end)
    })

    while (true) {
        var current = false

        for (var node in opened) {
            if (!current || current.t > opened[node].t) {
                current = opened[node]
            }
        }

        if (!current) { break; }

        remove(opened, current.pos)
        add(closed, current)

        addNeighbours(map, opened, closed, current, end, mode)

        if (get(closed, end) || get(opened, end)) { break }
    }

    return calc(map, opened, closed, start, end, mode)
}

function addNeighbours(map, opened, closed, node, end, mode) {
    var f = node.s + 10

    Vec2.forEach(
        new Vec2(node.pos.x - 1, node.pos.y - 1),
        new Vec2(node.pos.x + 1, node.pos.y + 1),
        (pos) => {
            if ((pos.x !== node.pos.x || pos.y !== node.pos.y) && !get(closed, pos)) {
                var d = Vec2.dist(pos , end)
                add(open(map, pos, mode) && opened || closed, {
                    pos: pos,
                    s: f,
                    d: d,
                    t: d + f,
                    p: node,
                })
            }
        }
    )
}

function calc(map, opened, closed, start, end, mode) {
    if (!get(closed, end) && !get(opened, end)) { return [] }

    var prev = get(closed, end) || get(opened, end)
    var path = []
    while (prev.p) {
        path.push(prev.pos)
        prev = prev.p
    }

    path.reverse()

    if (!open(map, end, mode)) {
        path.pop()
    }

    return path
}

function line(map, start, end, mode) {
    var good = true
    var steps = Math.max(Math.abs(start.x - end.x), Math.abs(start.y - end.y))
    var x, y, p = 0
    for (var step = 0; step < steps; step++) {
        p = step / steps
        x = Math.floor(start.x * (1-p) + end.x * p)
	    y = Math.floor(start.y * (1-p) + end.y * p)
        if (x !== start.x && y !== start.y) {
            if (!open(map, Vec2(x, y), mode)) {
                good = false
            }
        }
    }
    return good
}

export default {
    find: find,
    line: line
}
