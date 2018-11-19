import GlobalKey from "../util/GlobKey"

var id = {}

export default class Base {
    constructor(list) {
        var name = this.constructor.name
        if (!(name in id)) {
            id[name] = 0
        }
        this.id = name.charAt(0).toUpperCase() + id[name]
        id[name] += 1

        list[this.id] = this
        list[this.name] = this

        this.key = GlobalKey.getNewKey()
    }

	Setup(params) {
        if (params) {
			Object.keys(params).map((key) => {
				return (this[key] = params[key])
			})
        }
	}

	Clone(params) {
		var copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
        copy.key = GlobalKey.getNewKey()
        copy.Setup(params)
		return copy
	}
}

// TODO: ui
// TODO: loading stuff
