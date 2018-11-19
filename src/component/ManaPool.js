let ManaPool = (superclass) => class extends superclass {
    MP(mp) {
        if (mp) {
            if (typeof mp === 'object') {
                mp = Math.floor(Math.random() * (mp[1] - mp[0] + 1)) + mp[0]
            }

            this.mp += mp

            // TODO: max mp + 0 mp
            // TODO: temp mp
        }

        return this.mp
    }
}

export default ManaPool
