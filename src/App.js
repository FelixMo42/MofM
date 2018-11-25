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

var handToHand = new Skill({name: "hand-to-hand"})
var defence = new Skill({name: "defence"})
var dodge = new Skill({name: "dodge"})

// create actions //

var move = new Action({name: "move", cost: {moves: {move: -1}}, cheak: (self, pos) => {
    return self.Map().Tile(pos).Walkable()
}})
move.AddEffect({
    style: "self",
    player: {
        push: -1
    }
})

var punch = new Action({name: "punch", skill: handToHand, cost: {moves: {main: -1}}})
punch.AddEffect({
    style: "ball",
    player: {
        hp: [-10,-5]
    }
})

var pickup = new Action({name: "pickup", cost: {moves: {sub: -1}}})
pickup.AddEffect({
    item: {
        pickup: true
    }
})

// create items //

var gun = new Item({name: "gun", color: "brown", slot: "hands"})

// create players //

var eb = new Player({name: "Eden Black"})
eb.Learn(move)
eb.Learn(punch)
eb.Learn(pickup)
eb.controller = "player"
eb.color = "black"

var ew = new Player({name: "Eden White"})
ew.Learn(move)
ew.Learn(punch)
eb.Learn(pickup)
ew.color = "white"

eb.target = ew
ew.target = eb

// create tile //

var grass = new Tile({color: "green"})
var floor = new Tile({color: "gray"})

// create structors //

var wall = new Structor({color: "black", walkable: false})

// set up world //

var world = new Map({name: "MoM", base: grass})

world.SetTile(floor, new Vec2(2,2), new Vec2(7,7))

world.SetStructor(wall, new Vec2(2,2), new Vec2(7,7))
world.SetStructor(false, new Vec2(3,3), new Vec2(6,6))
world.SetStructor(false, new Vec2(4,2), new Vec2(5,7))
world.SetStructor(false, new Vec2(2,4), new Vec2(7,5))

world.SetItem(gun, new Vec2(1,8))

world.PutPlayer(eb,new Vec2(0,9))
world.PutPlayer(ew,new Vec2(9,0))

// render world //

export default class App extends React.Component {
    render() {
        return <Game world={world} />
    }
}
