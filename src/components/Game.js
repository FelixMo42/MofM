import React from 'react';

import Map from '../classes/Map'

export default class Game extends React.Component {
    constructor() {
        super();

        this.world = new Map();

        this.FPS = 40;
    }

    draw() {
        this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.world.draw(this.graphics);
    }

    update() {

    }

    onMouseDown(e) {
        this.world.onMouseDown(Math.floor(e.clientX/60), Math.floor(e.clientY/60));
    }

    resize() {
        this.canvas.width = window.innerWidth * devicePixelRatio;
        this.canvas.height = window.innerHeight * devicePixelRatio;

        this.graphics.lineWidth = 2;
    }

    componentDidMount() {
        this.canvas = this.refs.canvas;
        this.graphics = this.canvas.getContext("2d");

        this.resize();
        window.addEventListener("resize", this.resize.bind(this));

        this.drawLoop = setInterval(() => this.draw(), 1000/this.FPS);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize.bind(this));

        this.clearInterval(this.drawLoop);
    }

    render() {
        return (
            <div>
                <canvas
                    id="Game"
                    ref="canvas"
                    onClick={(e) => {this.onMouseDown(e)}}
                />
                { this.world.html }
            </div>
        );
    }
}
