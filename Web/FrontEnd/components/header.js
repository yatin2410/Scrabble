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
            playerRack: "",
            error:"",
        };
        
        this.setState(
            {
                playerScore:this.props.playerScore,
                PCScore:this.props.PCScore,
                PCRack:this.props.PCRack,
                playerRack:this.props.playerRack
            }
        );

        this.getRackScore.bind(this);

    }

    componentWillReceiveProps(nextProps)
    {
        console.log('props',nextProps);
        if(nextProps.playerRack==undefined && nextProps.PCScore==undefined && nextProps.PCRack==undefined && nextProps.playerScore==undefined)
        {
            this.setState({error:"Game Ended"});
            this.getRackScore();
        }
        else{
            this.setState({error:""});
            this.setState(
                {
                    playerScore:nextProps.playerScore,
                    PCScore:nextProps.PCScore,
                    PCRack:nextProps.PCRack,
                    playerRack:nextProps.playerRack
                }
            );
        }
    }

    getRackScore(){
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

    componentDidMount()
    {
        this.getRackScore();
    }

    render(){
        return(
            <div>
                <header class="header clearfix">
                <nav>
                    <ul class="nav nav-pills float-right">
                        <li class="nav-item">
                            <a class="nav-link mobi" href="/">Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link mobi" href="/users/logout">LogOut</a>
                        </li>
                    </ul>
                </nav>
                <h2 class="text-muted mobi1">Scrabble</h2>
                <hr/>
                <div>
                    <div className="left-one">
                        <h5 className="text-success mobi">
                            Your Rack:
                            <span className="rackscore mobi">
                            {this.state.playerRack}
                            </span>
                        </h5>
                        <h5 className="text-success mobi">
                            Your Score:
                            <span className="rackscore mobi">
                                {this.state.playerScore}
                            </span>
                        </h5>
                    </div>
                    <div  className="right-one">
                        <h5 className="text-success mobi">
                            PC's Rack:
                            <span className="rackscore mobi">
                                {this.state.PCRack}
                            </span>
                        </h5>
                        <h5 className="text-success mobi">
                            PC's Score:
                            <span className="rackscore mobi">
                                {this.state.PCScore}
                            </span>
                        </h5>
                    </div>
                    <div className="middle-one">
                        <h2 className="text-danger mobi">
                            {this.state.error}
                        </h2>
                    </div>
                </div>
            </header>
            </div>
        );
    }
}

export default Header;