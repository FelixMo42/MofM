import React from 'react';

export default class MapHTML extends React.Component {
    constructor(params) {
        super(params);

        this.state = {update: false};
        this.state.map = params.map;

        this.state.map.update = () => {
            this.setState({update: true});
        }
    }

    render() {
        return (
            <div>
                { this.state.map.players.map((player, key) => player.html) }
            </div>
        );
    }
}
