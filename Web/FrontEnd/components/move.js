import React from 'react';
import './main.css';
import './bootstrap.css';

class Move extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            row: "",
            col: ""
        }
        if(this.props.startingPos!=null)
        {
            this.setState({row:this.props.startingPos.row,col:this.props.startingPos.col});
        }
    }

    componentWillReceiveProps(nextprops)
    {
        if(nextprops.startingPos!=null)
        {
            this.setState({row:nextprops.startingPos.row,col:nextprops.startingPos.col});
        }
    }

    render(){
        return(
            <div  className="move">
                <form className="form">
                    <div className="form-group">
                        <label>Starting Position: {this.state.row} {this.state.col} </label>
                        <input type="text" className="form-control" placeholder="enter word" />
                        <small class="form-text text-muted">Please enter proper word...</small>
                    </div>
                    <button type="button" className="btn btn-primary btn-lg">
                        Place Word
                    </button> 
                </form>
                <div className="btn1">
                    <button onClick={this.props.onChangeRack} type="button" className="btn btn-info btn-lg">
                        Change Rack
                    </button>
                </div>
                    <div className="btn1">
                    <button onClick={this.props.onPass} type="button" className="btn btn-warning btn-lg">
                        Pass
                    </button>
                    </div>
                    <div className="btn1">
                    <button onClick={this.props.onQuit} type="button" className="btn btn-danger btn-lg">
                            Quit
                    </button>
                    </div>
            </div>
        );
    }
}

export default Move;