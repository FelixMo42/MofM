import React from 'react'

import './App.css'
import Game from './new/element/Game'

import Structor from './new/Structor'
import Item from './new/Item'
import Skill from './new/Skill'
import Action from './new/Action'
import Player from './new/Player'
import Tile from './new/Tile'
import Map from './new/Map'

var handToHand = new Skill({name: "Hand-to-Hand"})
var swordsmenship = new Skill({name: "Swordsmenship"})

var punch = new Action({name: "Punch", skill: handToHand, cost: {mp: -10}})
punch.AddEffect({
    player: {
        hp: [-20,-10]
    }
})

var pickup = new Action({name: "Pickup", cost: {mp: -5}})
pickup.AddEffect({
    item: {
        pickup: true
    }
})

var slice = new Action({name: "SLice"})
slice.AddEffect({

})

var sword = new Item({name: "Sword"})
sword.AddEffect({
    actions: {

    }
})


var eb = new Player({name: "Eden Black"})
var ew = new Player({name: "Eden White"})
var solder = new Player({name: "Solder"})

var a = eb.Learn(punch)
var b = eb.Learn(pickup)

// set up world

var grass = new Tile()
var world = new Map({name: "MoM", base: grass})
world.PutPlayer(eb,0,1)
world.PutPlayer(ew,1,1)
world.SetItem(sword,0,1)

// do stuff in world

a.Do(1,1)
b.Do(0,1)

console.log(ew)
console.log(eb)

export default class App extends React.Component {
    render() {
        return <Game />
    }
}
