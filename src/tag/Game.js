import React from 'react';

import Map from '../Map'

export default class Game extends React.Component {
    constructor(world) {
        super();

        this.world = world;

        this.FPS = 30;
    }

    draw() {
        this.graphics.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.world.Render(this.graphics);
    }

    onMouseDown(e) {
        //this.world.onMouseDown(Math.floor(e.clientX/this.graphics.size), Math.floor(e.clientY/this.graphics.size));
    }

    onMouseMoved(e) {
        //this.world.onMouseMoved(Math.floor(e.clientX/this.graphics.size), Math.floor(e.clientY/this.graphics.size));
    }

    onKeyPress(e) {
        //this.world.onKeyPress(e.key);
    }

    resize() {
        this.canvas.width = window.innerWidth * devicePixelRatio;
        this.canvas.height = window.innerHeight * devicePixelRatio;

        this.graphics.lineWidth = 2;
        this.graphics.size = 56;
        this.graphics.font = "16px Arial";
        this.graphics.textAlign = "center";
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

    contextMenu(e) {
        //e.preventDefault();
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
            </div>
        );
    }
}