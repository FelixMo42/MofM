import Rules from "../util/Rules"

let HealthPool = (superclass) => class extends superclass {
    HP(hp, aim) {
        if (hp) {
            if (typeof hp === 'object') {
                hp = Math.floor(Math.random() * (hp[1] - hp[0] + 1)) + hp[0]
            }

            if (aim !== undefined && this.Dodge) {
                hp = Rules.Dodge(aim, this.Dodge(), hp)
            }

            if (this.hp < 0 && this.DR) {
                var dr = this.DR()
                if (dr >= -hp) {
                    console.debug("block")
                    hp = 0
                } else {
                    hp += dr
                }
            }

            console.debug(this.name + "'s hp changed by "+ hp + " points")
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
