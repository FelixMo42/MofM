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

let Interface = (superclass) => class extends superclass {
    constructor(params) {
        super(params)

        this.UpdateHTML = () => {}
        this.html = <UI data={this} key={this.key}/>
    }
}

export default Interface
