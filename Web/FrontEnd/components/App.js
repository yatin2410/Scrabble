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
            iserr: false,
            err:"",
            win:""
        };

        this.onChangeRack = this.onChangeRack.bind(this);
        this.onPass = this.onPass.bind(this);
        this.onQuit = this.onQuit.bind(this);
        this.putWord = this.putWord.bind(this);
        this.onFirst = this.onFirst.bind(this);
    }

    onFirst(){
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
           
    this.setState({iserr:false,err:''});
    }
    
    
    onChangeRack(){
                 axios.get('changerack')
                 .then((response) => this.setState(
                     {
                        playerRack:response.data.playerRack,
                        PCRack:response.data.PCRack,
                        playerScore:response.data.playerScore,
                        PCScore:response.data.PCScore,
                        board:response.data.board,
                        win:response.data.error
                    }
                ));
                    this.setState({iserr:false,err:''});
                    if(this.state.win=="ENDING")
                    {
                        alert("ENDING");
                    }
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
               
        this.setState({iserr:false,err:''});
        
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
            this.setState({iserr:false,err:''});
            this.onFirst();
    }

    putWord(data)
    {
        console.log(data);
        if(data.col=="" || data.row=="")
        {
            console.log('hmmm');
            this.setState({iserr:true,err:'Please select starting pos...'})
            return;
        }

        axios({
            method: 'post',
            url: 'myturn',
            data: data,
            config: { headers: {'Content-Type': 'multipart/form-data' }}
            })
            .then(
                (response) => this.setState(
                    {
                       playerRack:response.data.playerRack,
                       PCRack:response.data.PCRack,
                       playerScore:response.data.playerScore,
                       PCScore:response.data.PCScore,
                       board:response.data.board,
                       iserr:response.data.iserr,
                       err:response.data.err
                   }
                )        
            )
            .catch(function (response) {
                //handle error
                this.setState({iserr:true,err:'Cannot connect to server...'})
                console.log(response);
        });


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
                iserr = {this.state.iserr}
                putWord = {this.putWord}
                err = {this.state.err}
                onFirst = {this.onFirst}
            />
            </div>
            <hr/>
            <Play/>
            </div>
        );
    }
}

export default App;