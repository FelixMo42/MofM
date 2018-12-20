export default class Controller {
    static Mode(mode) {
        if (mode) {
            this.mode = mode
        }
        return this.mode
    }

    static Action(action) {
        if (action) {
            this.action = action
            this.player = action.Player()
            this.map = action.Map()
            action.Player().UpdateHTML()
        }
        return this.action
    }

    static TurnOver(player) {
        if (this.mode === "auto") {
            return true
        } else if (this.mode === "smooth") {
            for (var move in player.Moves()) {
                if (player.Moves(move) === 0) {
                    return true
                }
            }
            return false
        } else if (this.mode === "combat") {
            for (var maxmove in player.Moves()) {
                if (player.Moves(maxmove) !== 0) {
                    return false
                }
            }
            return true
        }
    }

    static DoAction(action, pos) {
        action.Do(pos)
        if (this.TurnOver(action.Player())) {
            action.Player().EndTurn()
        } else {
            action.Player().UpdateHTML()
        }
    }

    // graphics

    static OnMouseDown(pos) {
        if (!this.map || this.map.player.controller !== "player") {
            return
        }
        if (this.action && this.map.player === this.action.Player()) {
            this.DoAction(this.action, pos)
        }
    }

    static OnMouseMoved(pos) {
        if (!this.map || this.map.player.controller !== "player") {
            return
        }
    }

    static OnKeyPress(key) {
        if (!this.map || this.map.player.controller !== "player") {
            return
        }
        if (key === "Enter") {
            this.map.player.EndTurn()
        }
    }

    static DrawUI(ctx) {
        if (!this.map || this.map.player.controller !== "player") {
            return
        }
        this.action.DrawUI(ctx)
    }
}

Controller.Mode("combat")
