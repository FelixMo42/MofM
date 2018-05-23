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

    value(base, stat) {
        if (base) {
            return base + Math.sign(base) * this.level
        } else if (stat) {
            return base + Math.sign(base) * (this.level + this.player.stats[stat.toLowerCase()]);
        } else {
            return this.level;
        }
    }

    roll(stat) {
        return this.value(Math.floor(Math.random() * 20 + 1), stat);
    }
}
