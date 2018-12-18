import Rules from "../util/Rules"

let ManaPool = (superclass) => class extends superclass {
    MP(mp, aim) {
        if (mp) {
            if (typeof mp === 'object') {
                mp = Math.floor(Math.random() * (mp[1] - mp[0] + 1)) + mp[0]
            }

            if (aim !== undefined && this.Dodge) {
                mp = Rules.Dodge(aim, this.Dodge(), mp)
            }

            console.debug(this.name + "'s mp changed by "+ mp + " points")

            this.mp += mp

            // TODO: max mp + 0 mp
            // TODO: temp mp
        }

        return this.mp
    }
}

export default ManaPool
