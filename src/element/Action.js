import Base from "../component/Base"

const Actions = {}

const styles = {
    click: {
        cheak: (obj, comp, x, y) => {
            return true
        },
        do: (map, sx, sy, tx, ty, effect) => {
            map.Tile(tx,ty).Affect(effect)
        }
    }
}

export default class Action extends Base {
    constructor(params) {
        super(Actions)
        this.Setup(params)
    }

    name = "def"
    style = "click"
    effects = []

    cost = {}

    // accessors

    Player() {
        return this.player
    }

    // functions

    SetSources(effect) {
        effect.source = this
        if (effect.player) {
            effect.player.source = this
        }
        if (effect.item) {
            effect.item.source = this
        }
        if (effect.structor) {
            effect.structor.source = this
        }
    }

    Setup(params) {
        super.Setup(params)

        for (var i = 0; i < this.effects.length; i++) {
            this.SetSources(this.effects[i])
        }
    }

    AddEffect(effect) {
        if (!effect.style) {
            effect.style = this.style
        }
        if (!effect.skill && this.skill) {
            effect.skill = this.skill
        }

        this.effects.push(effect)
    }

    Do(x, y) {
        // TODO: cheak - return false

        this.player.Affect(this.cost)

        for (var i = 0; i < this.effects.length; i++) {
            styles[this.effects[i].style].do(this.player.Map(), this.player.Tile().x, this.player.Tile().y, x, y, this.effects[i]);
        }

        return true
    }
}

export { Actions }

// TODO: balance system
