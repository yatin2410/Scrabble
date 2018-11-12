import React from 'react';
import './main.css';
import './bootstrap.css';
import axios from 'axios';

class Header extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            playerScore: 0,
            PCScore: 0,
            PCRack: "",
            playerRack: ""
        };
        
        this.setState(
            {
                playerScore:this.props.playerScore,
                PCScore:this.props.PCScore,
                PCRack:this.props.PCRack,
                playerRack:this.props.playerRack
            }
        );

    }

    componentWillReceiveProps(nextProps)
    {
        console.log('props',nextProps);
        this.setState(
            {
                playerScore:nextProps.playerScore,
                PCScore:nextProps.PCScore,
                PCRack:nextProps.PCRack,
                playerRack:nextProps.playerRack
            }
        );
    }

    componentDidMount()
    {
        axios.get('/rackandscore')
        .then(response => this.setState({
            playerRack:response.data.playerRack,
            PCRack:response.data.PCRack,
            playerScore:response.data.playerScore,
            PCScore:response.data.PCScore
        }
        ));

        console.log(this.state);

    }

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
                            <span className="rackscore">
                            {this.state.playerRack}
                            </span>
                        </h5>
                        <h5 className="text-success">
                            Your Score:
                            <span className="rackscore">
                                {this.state.playerScore}
                            </span>
                        </h5>
                    </div>
                    <div  className="right-one">
                        <h5 className="text-success">
                            PC's Rack:
                            <span className="rackscore">
                                {this.state.PCRack}
                            </span>
                        </h5>
                        <h5 className="text-success">
                            PC's Score:
                            <span className="rackscore">
                                {this.state.PCScore}
                            </span>
                        </h5>
                    </div>
                    {/* <div className="middle-one">
                        <h2 className="text-danger">
                            LOG
                        </h2>
                    </div> */}
                </div>
            </header>
            </div>
        );
    }
}

export default Header;