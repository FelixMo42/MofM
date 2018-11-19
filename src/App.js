import React from 'react'

import './App.css'
import Game from './tag/Game'

import Structor from './data/Structor'
import Item from './data/Item'
import Skill from './data/Skill'
import Action from './data/Action'
import Player from './data/Player'
import Tile from './data/Tile'
import Map from './data/Map'

// create data //

var handToHand = new Skill({name: "hand-to-hand"})
var swordsmenship = new Skill({name: "swordsmenship"})

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

var eb = new Player({name: "Eden Black"})
var ew = new Player({name: "Eden White"})
var solder = new Player({name: "Solder"})

var a = eb.Learn(punch)
var b = eb.Learn(pickup)

// set up world //

var grass = new Tile()
var world = new Map({name: "MoM", base: grass})
world.PutPlayer(eb,0,1)
world.PutPlayer(ew,1,1)
world.SetItem(sword,0,1)

// do stuff in world //

a.Do(1,1)
b.Do(0,1)

console.log(ew)
console.log(eb)


// test //

export default class App extends React.Component {
    render() {
        return <Game world={world} />
    }
}
