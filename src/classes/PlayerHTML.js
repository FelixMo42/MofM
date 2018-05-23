import React from 'react';
import Draggable from 'react-draggable';

export default class PlayerHTML extends React.Component {
    constructor(params) {
        super(params);
        this.state = {open: true, window: "info", update: false};
        this.player = params.player;

        this.player.update = () => {
            this.setState({update: true});
        }
    }

    render() {
        if (this.state.open) {
            return (
                <Draggable defaultPosition={{x: 100, y: 100}} handle=".box" cancel="span" bounds="#Game">
                    <div className="player box">
                        { this.player.turn ?
                            <b className="top cancel">
                                {this.player.name} | lv: {this.player.level} xp: {this.player.xp} |
                                <span className="dropdown" onClick={() => {this.setState({open: false})}}> V </span>
                            </b>
                                :
                            <span className="top cancel">
                                {this.player.name} | lv: {this.player.level} xp: {this.player.xp} |
                                <span className="dropdown" onClick={() => {this.setState({open: false})}}> V </span>
                            </span>
                        }

                        <hr />
                            { this.state.window === "info" ? this.renderInfo() : "" }
                            { this.state.window === "gear" ? this.renderGear() : "" }
                            { this.state.window === "skills" ? this.renderSkills() : "" }
                            { this.state.window === "actions" ? this.renderActions() : "" }
                        <hr />

                        <span onClick={() => {this.setState({window: "info"})}}>info </span>|
                        <span onClick={() => {this.setState({window: "gear"})}}> gear </span>|
                        <span onClick={() => {this.setState({window: "skills"})}}> skills </span>|
                        <span onClick={() => {this.setState({window: "actions"})}}> actions</span>
                    </div>
                </Draggable>
            );
        } else {
            return (
                <Draggable defaultPosition={{x: 100, y: 100}} handle=".box" cancel="span" bounds="#Game">
                    <div className="player box">
                        <span className="top cancel">
                            {this.player.name} | lv: {this.player.level} xp: {this.player.xp} |
                            <span className="dropdown" onClick={() => {this.setState({open: true})}}> > </span>
                        </span>
                    </div>
                </Draggable>
            );
        }
    }

    renderInfo() {
        return (
            <span id="info">
                <span>HP: {this.player.hp} / {this.player.hpMax} + {this.player.hpRegen}</span><br />
                <span>MP: {this.player.mp} / {this.player.mpMax} + {this.player.mpRegen}</span>
                <hr className="light" />
                <span>INT: {this.player.stats.str} | WIL: {this.player.stats.con} | CHR: {this.player.stats.dex}</span><br />
                <span>STR: {this.player.stats.str} | CON: {this.player.stats.con} | DEX: {this.player.stats.dex}</span>
            </span>
        );
    }

    renderGear() {
        return (
            <span id="gear">
            </span>
        );
    }

    renderSkills() {
        return (
            <span id="skills">
                { Object.keys(this.player.skills).map((name) =>
                    <span key={name}>- {name} | level: {this.player.skills[name].level}<br /></span>
                ) }
            </span>
        );
    }

    renderActions() {
        return (
            <span id="actions">
                <span>move: {this.player.moves.move} | main: {this.player.moves.main} | sub: {this.player.moves.sub}</span><br />
                <hr className="light"/>
                { Object.keys(this.player.actions).map((name) =>
                    <span key={name}> {this.player.turn && this.player.controller === "player" ?
                        <input type="checkbox" checked={this.player.tile.map.action.name === name} onChange={() => {this.player.tile.map.setAction( this.player.actions[name] );}} />
                    : "-"} {name} | <br /></span>
                ) }
            </span>
        );
    }
}
