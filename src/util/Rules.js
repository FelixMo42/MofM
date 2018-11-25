export default {
    Dodge(aim, dodge, value) {
        // return value
        // TODO: add info return system
        if (aim >= dodge * 2) {
            return value * 2
        } else if (aim >= dodge) {
            return value
        } else if (aim < dodge) {
            return value / 2
        } else if (aim < dodge / 2) {
            return 0
        }
    }
}
