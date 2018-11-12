import React from 'react';
import './main.css';
import './bootstrap.css';
import Square from './square';

class Board extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            values : this.props.values,
            tdata: null
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
            <Square
                value = {this.state.values[(i-1)*16+j]}
                row = {i-1}
                col = {j-1}
                whichPos = {this.props.whichPos}
            />
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

export default Board;