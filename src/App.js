import React from 'react'

import './App.css'
import Game from './tag/Game'

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

var move = new Action({name: "move"})
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

var slice = new Action({name: "sLice"})
slice.AddEffect({

})

var sword = new Item({name: "sword"})
sword.AddEffect({
    actions: {

    }
})

// create players //

var eb = new Player({name: "Eden Black"})
eb.Learn(punch)
eb.Learn(pickup)
eb.Learn(move)

var ew = new Player({name: "Eden White"})
ew.Learn(move)

// set up world //

var grass = new Tile()
var world = new Map({name: "MoM", base: grass})
//world.PutPlayer(eb,0,0)
world.PutPlayer(ew,4,4)
world.SetItem(sword,0,1)

export default class App extends React.Component {
    render() {
        return <Game world={world} />
    }
}
