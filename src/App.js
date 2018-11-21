import React from 'react'

import './App.css'
import Game from './tag/Game'
import Vec2 from './util/Vec2'

import Structor from './element/Structor'
import Item from './element/Item'
import Skill from './element/Skill'
import Action from './element/Action'
import Player from './element/Player'
import Tile from './element/Tile'
import Map from './element/Map'

// create skills //

var handToHand = new Skill({name: "hand-to-hand"})
var swordsmenship = new Skill({name: "swordsmenship"})

// create actions //

var move = new Action({name: "move", cost: {moves: {move: -1}}})
move.AddEffect({
    style: "self",
    player: {
        push: -1
    }
})

var punch = new Action({name: "punch", skill: handToHand, cost: {mp: -10}})
punch.AddEffect({
    player: {
        hp: [-20,-10]
    }
})

var pickup = new Action({name: "pickup", cost: {mp: -5}})
pickup.AddEffect({
    item: {
        pickup: true
    }
})

var slice = new Action({name: "slice"})
slice.AddEffect({

})

var sword = new Item({name: "sword"})
sword.AddEffect({
    actions: {

    }
})

// create players //

var eb = new Player({name: "Eden Black"})
eb.Learn(move)
eb.Learn(punch)
//eb.controller = "player"
eb.color = "black"

var ew = new Player({name: "Eden White"})
ew.Learn(move)
ew.Learn(punch)
ew.color = "white"

eb.target = ew
ew.target = eb

// set up world //

var grass = new Tile()
var world = new Map({name: "MoM", base: grass})
world.PutPlayer(eb,new Vec2(0,9))
world.PutPlayer(ew,new Vec2(9,0))

//*

export default class App extends React.Component {
    render() {
        return <Game world={world} />
    }
}

/*

///

export default class App extends React.Component {
    render() {
        return <p />
    }
}

//*/
