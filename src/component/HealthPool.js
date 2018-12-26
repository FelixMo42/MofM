import Value from "../util/Value"
import Rules from "../util/Rules"
let HealthPool = (superclass) => class extends superclass {
    HP(hp, params) {
        params = params || {}
        if (hp) {
            if (hp instanceof Value) {
                hp = hp.Value()
            }

            if (params.aim !== undefined && this.Dodge) {
                var aim = params.aim.Value()
                if (aim instanceof Value) {
                    aim = aim.Value()
                }
                hp = Rules.Dodge(aim, this.Dodge(), hp)
            }

            if (this.hp < 0 && this.DR) {
                var dr = this.DR()
                if (dr >= -hp) {
                    if (params.stack) {
                        params.stack.push(() => {
                            this.Map().Log(this, "blocked", "black")
                            return true
                        })
                    }
                    hp = 0
                } else {
                    hp += dr
                }
            }

            console.debug(this.name + "'s hp changed by " + hp + " points")
            if (hp < 0) {
                if (params.stack) {
                    params.stack.push(() => {
                        this.Map().Log(this, hp, "red")
                        return true
                    })
                }
            }
            if (hp > 0) {
                if (params.stack) {
                    params.stack.push(() => {
                        this.Map().Log(this, hp, "green")
                        return true
                    })
                }
            }

            this.hp += hp

            if (this.hp <= 0) {
                this.Die()
            }

            // TODO: max health
            // TODO: temp health
        }

        return this.hp
    }
}

export default HealthPool
