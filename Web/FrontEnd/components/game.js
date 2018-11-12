import React from 'react';
import './main.css';
import './bootstrap.css';
import Move from './move';
import { string } from 'prop-types';
import Axios from 'axios';



function Square(value){

    if(value=="#")
        value = "";

return(
        <button className="square">
            {value}
        </button>
    );
}


class Board extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            values : this.props.values
        };
    }

    componentWillReceiveProps(nextprops)
    {
        this.setState({values:nextprops.values});
    }

    renderSquare(i,j)
    {
        // console.log(i,j,this.state.values[(i-1)*16+j]);
        return(
            Square(this.state.values[(i-1)*16+j])
        )
    }
    makeRow(i)
    {
        var row = [];
        for(var j=1;j<=16;j++)
        {
            row.push(this.renderSquare(i,j));
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
           var r =  this.makeRow(i);
           var rr = this.makeCol(r);
           col.push(rr);
        }
        console.log('here');
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

    constructor(props)
    {
        super(props);
    
        this.state = {
            values:Array(256).fill(""),
            str1: ""
        };
        
        Axios.get('/board')
        .then((response) => {
        
            this.setState({str1:(response.data)});        
            console.log(this.state.str1);
        
            var tmp = [];
            for(var i=0;i<256;i++)
                tmp.push("");

            for(var i=1;i<=15;i++)
                tmp[i+1] = i;
            
            var str = "ABCDEFGHIJKLMNO";
            for(var i=2;i<=16;i++)
                tmp[(i-1)*17-(i-2)] = str[i-2];
            
            console.log(response.data.length);
            for(var i=0;i<15;i++)
            {
                for(var j=0;j<15;j++)
                {
                    //console.log(i,j,this.state.str1[(i)*15+j]);
                    tmp[(i+1)*16+j+2]=this.state.str1[(i)*15+(j)];
                }
            }

            this.setState({values:tmp});

        });
    }

    render(){
        return(
            <div className="container">
                <div className="board">
                    <Board values={this.state.values}/>           
                </div>
                <Move/>
            </div>
        );
    }
}

export default Game;