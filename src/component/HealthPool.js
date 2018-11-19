let ManaPool = (superclass) => class extends superclass {
    HP(hp) {
        if (hp) {
            if (typeof hp === 'object') {
                hp = Math.floor(Math.random() * (hp[1] - hp[0] + 1)) + hp[0]
            }

            this.hp += hp

            // TODO: max health + death
            // TODO: temp health
        }

        return this.hp
    }
}

export default ManaPool