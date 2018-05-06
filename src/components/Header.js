import React from 'react';

export default class Header extends React.Component {
    render() {
        return (
            <nav id="Header" className="navbar navbar-expand-sm navbar-dark bg-dark fixed-top">
                <a className="navbar-brand" href="/">Lister</a>

                <button className="navbar-toggler collapsed" type="button" data-toggle="collapse" data-target="#navbar" aria-expanded="false">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="navbar-collapse collapse" id="navbar">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item active">
                            <a className="nav-link" href="/">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="/">Best</a>
                        </li>
                    </ul>

                    <form className="form-inline my-2 my-md-0">
                        <input className="form-control" type="text" placeholder="Search" />
                    </form>
                </div>
            </nav>
        );
    }
}
