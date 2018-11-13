import React from 'react';
import './main.css';
import './bootstrap.css';

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
  }
class Square extends  React.Component{
   
    constructor(props)
    {
        super(props);
        this.state = {
            value:"",
            row:0,
            col:0,
            classname: "square"
        }
        this.setState({value:this.props.value});
        if(!isLetter(this.state.value))
            {
                this.setState({classname:"sqr"});
        }
        this.setState({row:this.props.row,col:this.props.col});

    }

    componentWillReceiveProps(nextprops)
    {
        if(nextprops.value!=undefined){
           this.setState({value:nextprops.value},function(){
                
                    if(!isLetter(this.state.value) && (nextprops.row!=0 && nextprops.col!=0))
                    {
                    this.setState({classname:"sqr"});
                    }
                    else
                        this.setState({classname:"square"});
                }
           );
        }
        this.setState({row:nextprops.row,col:nextprops.col});
    }

    getRowCol()
    {
        this.props.whichPos(this.state);
    }

    render(){
            return(
                <button onClick={this.getRowCol.bind(this)} className={this.state.classname}>
                    {this.state.value}
                </button>
            );
    }
}


export default Square;