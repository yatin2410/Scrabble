import React from 'react';
import './main.css';
import './bootstrap.css';

class Move extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            row: "",
            col: "",
            err:"Please enter proper word...",
            iserr: false,
            word: "",
            hor: true
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
        if(nextprops.startingPos==null)
        {
            this.setState({row:"",col:""});
        }
        if(nextprops.iserr!=null)
        {
            this.setState({iserr:nextprops.iserr,err:nextprops.err});
        }
    }

    changeInput(eve)
    {
        this.setState({word:eve.target.value});
    }

    changeHV(eve)
    {
        this.setState({hor:!this.state.hor},function(){
            console.log(this.state.hor);
        });
    }

    render(){
        return(
            <div  className="move">
                <form className="form">
                    <div className="form-group">
                        <label>Starting Position: {this.state.row} {this.state.col} </label>
                        <br/>
                        <input type="search" id="name_input" name="search" autoComplete='off' className="form-control sldr1" placeholder="enter word" onChange={this.changeInput.bind(this)}/>
                        <small style={{visibility:this.state.iserr ? 'visible' : 'hidden'}} class="form-text text-danger sldr2">{this.state.err}</small>
                        <label class="switch">
                            <input type="checkbox" id="togBtn" onChange={this.changeHV.bind(this)} />
                            <div class="slider round">
                            </div>
                        </label>
                    </div>
                    <button onClick={this.props.putWord.bind(this,this.state)}  type="button" className="btn btn-primary btn-md">
                        Place Word
                    </button> 
                    <hr/>
                </form>
                <div className="btn1">
                    <button onClick={this.props.onChangeRack} type="button" className="btn btn-info btn-md">
                        Change Rack
                    </button>
                </div>
                    <div className="btn1">
                    <button onClick={this.props.onPass} type="button" className="btn btn-warning btn-md">
                        Pass
                    </button>
                    </div>
                    <hr/>
                    <div className="btn1">
                    <button onClick={this.props.onQuit} type="button" className="btn btn-danger btn-md">
                            New Game
                    </button>
                    </div>
            </div>
        );
    }
}

export default Move;