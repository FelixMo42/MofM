import React from 'react';
import Draggable from 'react-draggable';

export default class PlayerHTML extends React.Component {
    constructor(params) {
        super(params);
        this.state = {open: true, window: "info", update: false};
        this.state.player = params.player;

        this.state.player.update = () => {
            this.setState({update: true});
        }
    }

    render() {
        if (this.state.open) {
            return (
                <Draggable defaultPosition={{x: 100, y: 100}} handle=".box" cancel="span" bounds="#Game">
                    <div className="player box">
                        <span className="top cancel">
                            {this.state.player.name} | lv: {this.state.player.level} xp: {this.state.player.xp} |
                            <span className="dropdown" onClick={() => {this.setState({open: false})}}> V </span>
                        </span>
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
                            {this.state.player.name} | lv: {this.state.player.level} xp: {this.state.player.xp} |
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
                <span>HP: {this.state.player.hp} / {this.state.player.hpMax} + {this.state.player.hpRegen}</span><br />
                <span>MP: {this.state.player.mp} / {this.state.player.mpMax} + {this.state.player.mpRegen}</span>
                <hr className="light"/>
                <span>INT: {this.state.player.stats.str} | WIL: {this.state.player.stats.con} | CHR: {this.state.player.stats.dex}</span><br />
                <span>STR: {this.state.player.stats.str} | CON: {this.state.player.stats.con} | DEX: {this.state.player.stats.dex}</span>
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
            </span>
        );
    }

    renderActions() {
        return (
            <span id="actions">
                <span>move: {this.state.player.moves.move} | main: {this.state.player.moves.main} | sub: {this.state.player.moves.sub}</span><br />
                <hr className="light"/>
                {
                    Object.keys(this.state.player.actions).map((name) => {
                        return <span key={name}> - {name} | <br /></span>;
                    })
                }
            </span>
        );
    }
}
