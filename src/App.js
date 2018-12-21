import React from "react"

import "./App.css"
import Game from "./tag/Game"
import Vec2 from "./util/Vec2"

import Structor from "./element/Structor"
import Item from "./element/Item"
import Skill from "./element/Skill"
import Action from "./element/Action"
import Player from "./element/Player"
import Tile from "./element/Tile"
import Map from "./element/Map"

// create skills //

class Defence extends Skill {}
Defence.Register()

class HandToHand extends Skill {}
HandToHand.Register()

class Gunmanship extends Skill {}
Gunmanship.Register()

// create actions //

class Move extends Action {
    name = "move"

    cheaks = {
        range : 1,
        walkable: true
    }

    cost = class extends Action.Cost {
        moves = {
            move: -1
        }
    }

    effects = [
        class extends Action.Effect {
            style = Action.Styles("self")
            player = {
                push: -1
            }
        }
    ]
}
Move.Register()

class Pickup extends Action {
    name = "pickup"

    cheaks = {
        range: 1
    }

    cost = class extends Action.Cost {
        moves = {
            sub: -1
        }
    }

    effects = [
        class extends Action.Effect {
            item = {
                pickup: true
            }
        }
    ]
}
Pickup.Register()

class Punch extends Action {
    name = "punch"
    skill = HandToHand
    cheaks = {
        range: 1
    }
    cost = class extends Action.Cost {
        moves = {
            main: -1
        }
    }
    effects = [
        class extends Action.Effect {
            player = {
                hp: [-10,-5]
            }
        }
    ]
}
Punch.Register()

class Shoot extends Action {
    name = "shoot"
    skill = Gunmanship
    itemType = "gun"
    cheaks = {
        range: 10
    }
    cost = class extends Action.Cost {
        moves = {
            main: -1
        }
    }
    effects = [
        class extends Action.Effect {
            player = {
                hp: [-10,-5]
            }
        }
    ]
}
Shoot.Register()

Gunmanship.Action(Shoot)

class SuperShot extends Action {
    name = "super shot"
    skill = Gunmanship
    cost = class extends Action.Cost {
        moves = {
            main: -1
        }
        mp = -10
    }
    effects = []
}
SuperShot.Register()

Gunmanship.Action(SuperShot)

// create items //

class Gun extends Item {
    color = "brown"
    slot = "hands"
    name = "gun"
    type = "gun"
}

// create players //

class EdenBlack extends Player {
    name = "Eden Black"
    controller = "player"
    color = "black"
    actions = [
        Move,
        Punch,
        Shoot,
        Pickup
    ]
}

class EdenWhite extends Player {
    name = "Eden White"
    color = "white"
    actions = [
        Move,
        Punch,
        Pickup
    ]
}

// create tile //

class Grass extends Tile {
    color = "green"
}
Grass = Grass.Register()

class Floor extends Tile {
    color = "gray"
}
Floor.Register()

// create structors //

class Wall extends Structor {
    color = "black"
    walkable = false
}
Wall.Register()

// set up world //

var world = new Map({name: "MoM"})

world.SetTile(Grass, new Vec2(0,0), new Vec2(9,9))
world.SetTile(Floor, new Vec2(2,2), new Vec2(7,7))

world.SetStructor(Wall, new Vec2(2,2), new Vec2(7,7))
world.SetStructor(false, new Vec2(3,3), new Vec2(6,6))
world.SetStructor(false, new Vec2(4,2), new Vec2(5,7))
world.SetStructor(false, new Vec2(2,4), new Vec2(7,5))

world.SetItem(Gun, new Vec2(1,8))

var eb = new EdenBlack()
world.SetPlayer(new EdenWhite({target: eb}), new Vec2(9,0))
world.SetPlayer(eb, new Vec2(0,9))

// render world //

export default class App extends React.Component {
    render() {
        return <Game world={world} />
    }
}

// */
