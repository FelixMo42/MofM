var key = 0
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
    }

	Setup(params) {
		this.key = key
        key += 1

		if (params) {
			Object.keys(params).map((key) => {
				return (this[key] = params[key])
			})
        }
	}

	Clone(params) {
		var copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this)
		copy.Setup(params)
		return copy
	}
}

// TODO: ui
// TODO: loading stuff
