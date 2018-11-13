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
            supervalues: Array(257).fill("1"),
            tdata: null
        };
    }

    componentWillReceiveProps(nextprops)
    {
        this.setState({values:nextprops.values});
        
        var str = "511211151112115141113111311141114111212111411211411121114112111141111141111131113111311131112111212111211511211141112115112111212111211131113111311131111141111141111211411121114112114111212111411141113111311141511211151112115";
        
        var tmp = [];
            for(var i=0;i<256;i++)
                tmp.push("");

            for(var i=1;i<=15;i++)
                tmp[i+1] = i;
            
            
            for(var i=2;i<=16;i++)
                tmp[(i-1)*17-(i-2)] = i-1;
            
            for(var i=0;i<15;i++)
            {
                for(var j=0;j<15;j++)
                {
                    //console.log(i,j,this.state.str1[(i)*15+j]);
                    tmp[(i+1)*16+j+2]=str[(i)*15+(j)];
                }
            }
            console.log(tmp);
            this.setState({supervalues:tmp});

    }


    renderSquare(i,j)
    {

        //console.log(i,j,this.state.values[(i-1)*16+j]);
        return(
            <Square
                value = {this.state.values[(i-1)*16+j] == "#" ? this.state.supervalues[(i-1)*16+j] : this.state.values[(i-1)*16+j]}
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