import GlobalKey from "../util/GlobKey"

const ids = {}
const list = {}

export default class Base {
    constructor(params) {
        this.key = GlobalKey.NewKey()

        for (var key in params) {
            this[key] = params[key]
        }
    }

    static Register(name) {
        var type = this.__proto__.name.charAt(0).toUpperCase()

        if (!(type in list)) {
            list[type] = {}
        }

        if (!(type in ids)) {
            ids[type] = 0
        }

        var id = type + ids[type]
        ids[type] += 1

        this.id = id
        this.prototype.id = id

        list[type][id] = this

        if (this.name) {
            // TODO: cheak name formating
            // TODO: remove when name system removed
            list[type][this.name] = this
        }
    }

    static Get(id) {
        return list[this.name.charAt(0).toUpperCase()][id]
    }
}
