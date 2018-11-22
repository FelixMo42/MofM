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
            for (var k in player.Moves()) {
                if (player.Moves(k) == 0) {
                    return true
                }
            }
            return false
        } else if (this.mode === "combat") {
            for (var k in player.Moves()) {
                if (player.Moves(k) != 0) {
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
        if (!this.action || this.map.player !== this.action.Player() || this.map.player.controller !== "player") {
            return
        }
        this.DoAction(this.action, pos)
    }

    static OnMouseMove(pos) {

    }

    static OnKeyPress(key) {

    }
}

Controller.Mode("smooth")
