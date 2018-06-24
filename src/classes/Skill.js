export default class Skill {
    name = "def";

    level = 1;

    tree = {};

    /* functions */

    constructor(params) {
        if (params) {
            Object.keys(params).map((key) => {
                return (this[key] = params[key]);
            });
        }
    }

    bonus(stat) {
        var b = 0;
        if (this.player.increases[this.name]) {
            b += this.player.increases[this.name];
        }
        if (stat && this.player.increases[stat]) {
            b += this.player.increases[stat];
        }
        return b;
    }

    value(base, stat) {
        if (base) {
            return base + Math.sign(base) * this.level + this.bonus();
        } else if (stat) {
            return base + Math.sign(base) * (this.level + this.player.stats[stat.toLowerCase()]) + this.bonus(stat);
        } else {
            return this.level + this.bonus();
        }
    }

    roll(stat) {
        return this.value(Math.floor(Math.random() * 20 + 1), stat);
    }
}
