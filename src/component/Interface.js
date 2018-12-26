import React from 'react'

class UI extends React.Component {
    constructor(params) {
        super(params)
        this.state = {}

        this.UpdateHTML = () => {
            this.setState({update: true})
        }

        this.props.data.UpdateHTML = this.UpdateHTML
    }

    render() {
        return this.props.data.Render(this.state)
    }
}

class Sprite {
    log = {}

    constructor(target) {
        this.source = target
        this.target = new Proxy(target, this)
    }

    get(props, name) {
        if (name in this.log) {
            return this.log[name]
        }
        return props[name]
    }

    /*Position() {
        return this.log.node.pos
    }*/

    Render() {
        this.target.Render()
    }

    Draw(ctx, dt) {
        this.target.Draw(ctx, dt)
    }

    Log(name) {
        if (!(name in this.log)) {
            this.log[name] = this.source[name]
        }
    }

    Set(name, value) {
        this.log[name] = value
        if (this.log[name] === this.source[name]) {
            delete this.log[name]
        }
    }

    LogPosition() {
        if (!("node" in this.log)) {
            this.log.node = this.source.node
        }
    }

    SetPosition(pos) {
        var type = this.source.constructor.__proto__.name.toLowerCase()
        delete this.log.node.sprite[type]
        var node = this.source.Map().Node(pos)
        this.log.node = node
        node.sprite[type] = this
        console.log(node)
        //node[type] = this
        /*if (this.log[name] === this.source[name]) {
            delete this.log[name]
        }*/
    }
}

let Interface = (superclass) => class extends superclass {
    logs = {}

    constructor(params) {
        super(params)

        if (this.Render) {
            this.UpdateHTML = () => {}
            this.html = <UI data={this} key={this.key}/>
        }

        this.sprite = new Sprite(this)
    }
}

export default Interface
