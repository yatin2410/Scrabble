import React from 'react';
import Header from './header';
import Game from './Game';
import './main.css';
import './bootstrap.css';
import Play from './play';

class App extends React.Component{
    render(){
        return(
            <div class="container">
            <Header/>
            <div class="row ">
            <Game/>
            </div>
            <hr/>
            <Play/>
            </div>
        );
    }
}

export default App;