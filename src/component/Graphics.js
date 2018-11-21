let Graphics = (superclass) => class extends superclass {
    constructor(params) {
        super(params)

        var data = {}
        var funcs = {
            clear: () => {

            }
        }
        var target = this

        this.graphics = new Proxy({}, {
            get: function(obj, name) {
                if (funcs[name] !== undefined) {
                    return funcs[name]
                } else if (data[name] !== undefined) {
                    return data[name]
                } else {
                    return target[name]
                }
            },
            set: function(obj, name, value) {
                data[name] = value
                return true
            }
        })
    }
}

export default Graphics
