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
}
