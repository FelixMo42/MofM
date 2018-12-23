export default class Value {
    Cheak(value) {
        if (value instanceof Value) {
            return value.Value()
        } else {
            return value
        }
    }

    Constant() {
        return this.constant
    }
}

Value.Random = class extends Value {
    constructor(min, max) {
        super()
        this.min = min
        this.max = max
    }

    Constant() {
        return this.min === this.max
    }

    Value() {
        return Math.floor(Math.random() * (this.max - this.min + 1)) + this.min
    }
}
