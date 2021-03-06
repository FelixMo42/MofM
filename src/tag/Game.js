import React from 'react'
import Vec2 from '../util/Vec2'

export default class Game extends React.Component {
    FPS = 10
    lastUpdate = Date.now()

    constructor(props) {
        super(props)

        if (props.FPS) {
            this.FPS = props.FPS
        }

        this.world = props.world
        this.world.NextTurn()
    }

    draw() {
        var now = Date.now()
        this.graphics.dt = (now - this.lastUpdate) / 1000
        this.lastUpdate = now

        //console.log(this.graphics.dt)

        this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.world.Draw(this.graphics)
    }

    onMouseDown(e) {
        this.world.OnMouseDown(new Vec2(
            Math.floor(e.clientX/this.graphics.size),
            Math.floor(e.clientY/this.graphics.size)
        ))
    }

    onMouseMoved(e) {
        var vec = new Vec2(
            Math.floor(e.clientX/this.graphics.size),
            Math.floor(e.clientY/this.graphics.size)
        )
        if (this.world.Tile(vec)) {
            this.graphics.mousePos = vec
            this.world.OnMouseMoved(this.graphics.mousePos)
        }
    }

    onKeyPress(e) {
        this.world.OnKeyPress(e.key)
    }

    resize() {
        this.canvas.width = window.innerWidth * devicePixelRatio
        this.canvas.height = window.innerHeight * devicePixelRatio

        this.graphics.lineWidth = 2
        this.graphics.size = 56
        this.graphics.font = "16px Arial"
        this.graphics.textAlign = "center"
    }

    componentDidMount() {
        this.canvas = this.refs.canvas
        this.graphics = this.canvas.getContext("2d")
        this.graphics.mousePos = new Vec2(0,0)

        this.resize()
        window.addEventListener("resize", this.resize.bind(this))

        this.drawLoop = setInterval(() => this.draw(), 1000/this.FPS)
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize.bind(this))
        this.clearInterval(this.drawLoop)
    }

    contextMenu(e) {
        //e.preventDefault()
    }

    render() {
        return (
            <div>
                <canvas
                    id="Game"
                    ref="canvas"
                    tabIndex='1'

                    onContextMenu={this.contextMenu}

                    onClick={(e) => {this.onMouseDown(e)}}
                    onMouseMove={(e) => {this.onMouseMoved(e)}}
                    onKeyPress={(e) => {this.onKeyPress(e)}}
                />
                { this.world.html }
            </div>
        )
    }
}
