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
import Faction from "./element/Faction"

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

// create items //

class EdensRevolver extends Item {
    color = "brown"
    slot = "hands"
    name = "Eden Black's Revolver"
    type = "gun"
}
EdensRevolver.Register()

class PlasmaRifle extends Item {
    color = "silver"
    slot = "hands"
    name = "Plasma Rifle"
    type = "gun"
}
PlasmaRifle.Register()


// create factions //

class Rebels extends Faction {
    name = "rebel"
}
Rebels.Register()

// create characters //

class EdenBlack extends Player {
    name = "Eden Black"
    controller = "player"
    color = "black"
    items = [
        EdensRevolver
    ]
    actions = [
        Move,
        Pickup,
        Punch,
        Shoot
    ]
    links = [
        Rebels.Link(-1)
    ]
}
EdenBlack.Register()

class Solder extends Player {
    name = "solder"
    color = "gray"
    items = [
        PlasmaRifle
    ]
    actions = [
        Move,
        Pickup,
        Punch,
        Shoot
    ]
    links = [
        Rebels.Link(1)
    ]
}
Solder.Register()

// create tile //

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

world.SetTile(Floor, new Vec2(0,0), new Vec2(9,9))

world.SetStructor(Wall, new Vec2(0,0), new Vec2(9,9))
world.SetStructor(false, new Vec2(1,1), new Vec2(8,8))

world.SetPlayer(new EdenBlack(), new Vec2(1, 5))
world.SetPlayer(new Solder(), new Vec2(1, 1))
world.SetPlayer(new Solder(), new Vec2(1, 8))
world.SetPlayer(new Solder(), new Vec2(8, 8))
world.SetPlayer(new Solder(), new Vec2(8, 1))

// render world //

export default class App extends React.Component {
    render() {
        return <Game world={world} />
    }
}

// */
