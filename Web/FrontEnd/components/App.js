import React from 'react';
import Header from './header';
import Game from './Game';
import './main.css';
import './bootstrap.css';
import Play from './play';
import axios from 'axios';

class App extends React.Component{

    constructor(props)
    {
        super(props);
        this.state={
            playerScore: 0,
            PCScore: 0,
            PCRack: "ASJASJK",
            playerRack: "erdseds",
            board: "",
        };

        this.onChangeRack = this.onChangeRack.bind(this);
        this.onPass = this.onPass.bind(this);
        this.onQuit = this.onQuit.bind(this);


    }

    
    
    onChangeRack(){
                 axios.get('changerack')
                 .then((response) => this.setState(
                     {
                        playerRack:response.data.playerRack,
                        PCRack:response.data.PCRack,
                        playerScore:response.data.playerScore,
                        PCScore:response.data.PCScore
                    }
                    ));
    }
    onPass(){
            axios.get('gameonbitch')
            .then((response) => this.setState(
                {
                   playerRack:response.data.playerRack,
                   PCRack:response.data.PCRack,
                   playerScore:response.data.playerScore,
                   PCScore:response.data.PCScore,
                   board:response.data.board
               }
        ));
    }
    onQuit(){
        axios.get('exit')
            .then((response) => this.setState(
                {
                   playerRack:response.data.playerRack,
                   PCRack:response.data.PCRack,
                   playerScore:response.data.playerScore,
                   PCScore:response.data.PCScore,
                   board:response.data.board
               }
            ));
    }
    
    render(){
        return(
            <div class="container">
            <Header
                playerRack = {this.state.playerRack}
                PCScore = {this.state.PCScore}
                PCRack = {this.state.PCRack}
                playerScore = {this.state.playerScore}
            />
            <div class="row ">
            <Game
                onChangeRack = {this.onChangeRack}
                onPass = {this.onPass}
                onQuit = {this.onQuit}
                board = {this.state.board}
            />
            </div>
            <hr/>
            <Play/>
            </div>
        );
    }
}

export default App;