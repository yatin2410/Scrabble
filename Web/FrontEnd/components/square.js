import React from 'react';
import './main.css';
import './bootstrap.css';

class Square extends  React.Component{
   
    constructor(props)
    {
        super(props);
        console.log(this.props);
        this.state = {
            value:"",
            row:0,
            col:0,
        }
        if(this.state.value=="#")
            this.setState({value:""});
        this.setState({row:this.props.row,col:this.props.col});

    }

    componentWillReceiveProps(nextprops)
    {
        
        if(nextprops.value=="#")
            this.setState({value:""});
        else
            this.setState({value:nextprops.value});
        
            this.setState({row:nextprops.row,col:nextprops.col});
    }

    getRowCol()
    {
        this.props.whichPos(this.state);
    }

    render(){
            return(
                <button onClick={this.getRowCol.bind(this)} className="square">
                    {this.state.value}
                </button>
            );
    }
}


export default Square;