import React from 'react';
import './main.css';
import './bootstrap.css';
import Move from './move';


class Square extends React.Component{
    render()
    {
        return(
            <button className="square">
            </button>
        );
    }
}


class Board extends React.Component{

    renderSquare(i)
    {
        return(
            <Square/>
        )
    }
    makeRow()
    {
        var row = [];
        for(var i=1;i<=16;i++)
        {
            row.push(this.renderSquare(i));
        }
        return row;
    }
    makeCol(r)
    {
        return(
            <div className="board-row">
                {r}
            </div>
        )
    }
    makeTable()
    {
        var col = [];
        for(var i=1;i<=16;i++)
        {
           var r =  this.makeRow();
           var rr = this.makeCol(r);
           col.push(rr);
        }
        return col;
    }
    render()
    {
        return(
            <div>
                {this.makeTable()}
            </div>
        );
    }
}

class Game extends React.Component{
    render(){
        return(
            <div className="container">
                <div className="board">
                    <Board/>           
                </div>
                <Move/>
            </div>
        );
    }
}

export default Game;