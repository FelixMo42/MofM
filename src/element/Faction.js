import Base from "../component/Base"

export class Link {

}

export default class Faction extends Base {
    static links = {}

    static Link(value) {
        var link = {
            faction: this,
            value: value
        }
        link.Relationship = (player) => {
            return link.faction.Relationship(player) * link.value
        }
        return link
    }

    static Relationship(player) {
        return player.Link(this)
    }
}
