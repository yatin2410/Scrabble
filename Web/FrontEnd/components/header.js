import React from 'react';
import './main.css';
import './bootstrap.css';


class Header extends React.Component{
    render(){
        return(
            <div>
                <header class="header clearfix">
                <nav>
                    <ul class="nav nav-pills float-right">
                        <li class="nav-item">
                            <a class="nav-link" href="/">Deshboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/users/logout">LogOut</a>
                        </li>
                    </ul>
                </nav>
                <h3 class="text-muted">Scrabble</h3>
                <hr/>
                <div>
                    <div className="left-one">
                        <h5 className="text-success">
                            Your Rack:
                        </h5>
                        <h5 className="text-success">
                            Your Score:
                        </h5>
                    </div>
                    <div  className="right-one">
                        <h5 className="text-success">
                            PC's Rack:
                        </h5>
                        <h5 className="text-success">
                            PC's Score:
                        </h5>
                    </div>
                    <div className="middle-one">
                        <h2 className="text-danger">
                            Whose Turn?:
                        </h2>
                    </div>
                </div>
            </header>
            </div>
        );
    }
}

export default Header;