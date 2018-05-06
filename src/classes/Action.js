const styles = {
    ball: {
        cheak: (map, comp, x, y) => {
            return true; // TODO
        },
        do: (map, comp, x, y) => {
            map[x][y].affect(comp.effect);
        }
    },
    line: {
        cheak: (map, comp, x, y) => {
            return true; // TODO
        },
        do: (map, comp, x, y) => {
            map[x][y].affect(comp.effect);
        }
    }
}

export default class Action {
    name = "def";

    skill = "";

    moves = {};

    components = [];

    /* functions */

    constructor(params) {
        if (params) {
            Object.keys(params).map((key) => {
                return (this[key] = params[key]);
            });
        }
    }

    addComponent(obj) {
        if (!obj.style) { obj.style = "ball"; }
        this.components.push(obj);
    }

    cheak(x, y) {
        for (var i = 0; i < this.components.length; i++) {
            if ( styles[this.components[i].style].cheak(this.player.map, this.components[i], x, y) ) {
                return true;
            }
        }

        return false;
    }

    do(x, y) {
        if (!this.cheak(x, y)) { return false; }

        for (var i = 0; i < this.components.length; i++) {
            styles[this.components[i].style].do(this.player.map, this.components[i], x, y);
        }

        return true;
    }
}
