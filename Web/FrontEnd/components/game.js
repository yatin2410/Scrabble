import React from 'react';
import './main.css';
import './bootstrap.css';
import Move from './move';
import Axios from 'axios';
import Board from './board';

class Game extends React.Component{

    constructor(props)
    {
        super(props);
    
        this.state = {
            values:Array(256).fill(""),
            str1: "",
            tdata: null
        };
        
        this.whichPos.bind(this);

        Axios.get('/board')
        .then((response) => {
        
            this.setState({str1:(response.data)});        
            console.log(this.state.str1);
        
            var tmp = [];
            for(var i=0;i<256;i++)
                tmp.push("");

            for(var i=1;i<=15;i++)
                tmp[i+1] = i;
            
            for(var i=2;i<=16;i++)
                tmp[(i-1)*17-(i-2)] = i-1;
            
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

    componentWillReceiveProps(nextprops)
    {
        if(nextprops.board!="")
        {
            this.setState({str1:(nextprops.board)},()=>{
                
            console.log('a',nextprops.board);
            console.log('b',this.state.str1);
            var tmp = [];
            for(var i=0;i<256;i++)
                tmp.push("");

            for(var i=1;i<=15;i++)
                tmp[i+1] = i;
            
            
            for(var i=2;i<=16;i++)
                tmp[(i-1)*17-(i-2)] = i-1;
            
            console.log(nextprops.board.length);
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
    }


    whichPos(tdata){
        this.setState({tdata:tdata},function(){
            console.log(this.state);
        });
    }
    render(){
        return(
            <div className="container">
                <div className="board">
                    <Board 
                        values={this.state.values}
                        whichPos={this.whichPos.bind(this)}
                    />           
                </div>
                <Move 
                    onChangeRack={this.props.onChangeRack}
                    onPass = {this.props.onPass}
                    onQuit = {this.props.onQuit}
                    startingPos = {this.state.tdata}
                />
            </div>
        );
    }
}

export default Game;