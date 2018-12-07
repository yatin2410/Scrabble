import React from 'react';
import './main.css';
import './bootstrap.css';
import { element } from 'prop-types';


class Component extends React.Component {
    componentDidMount() {
      window.component = this;
    }
    
    change(word) {
        console.log(word);
       this.props.changeWord(word);
    } 
    render() {
      return (      
        <div></div>     
      );
    }
  }
  

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
        console.log("move prop",nextprops);
        if(nextprops.startingPos!=null)
        {
            this.setState({row:nextprops.startingPos.row,col:nextprops.startingPos.col});    
        }
        if(nextprops.startingPos==null)
        {
            this.setState({row:"",col:"",word:""});
            
        }
        if(nextprops.iserr!=null)
        {
            this.setState({iserr:nextprops.iserr,err:nextprops.err});
        }
    }

    changeWord(word)
    {
        console.log("in change");
        this.setState({word:word});
    }

    changeInput(eve)
    {
        console.log("in change");
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
            <div className="move">
                <form className="form">
                    <div className="form-group">
                        <label>Starting Position: {this.state.row} {this.state.col} </label>
                        <br/>
                        <input type="search" title="suggestions are limited to word length 5" id="name_input" name="search" autoComplete='off' className="form-control sldr1" placeholder="enter word" value={this.state.word} onChange={this.changeInput.bind(this)}/>
                        <small style={{visibility:this.state.iserr ? 'visible' : 'hidden'}} class="form-text text-danger sldr2">{this.state.err}</small>
                        <label class="switch">
                            <input type="checkbox" id="togBtn" onChange={this.changeHV.bind(this)} />
                            <div class="slider round">
                            </div>
                        </label>
                    </div>
                    <button onClick={this.props.putWord.bind(this,this.state)}  type="button" className="btn btn-primary btn-md mobi2">
                        Place Word
                    </button> 
                    <hr/>
                </form>
                <div className="others">
                <div className="btn1">
                    <button onClick={this.props.onChangeRack} type="button" className="btn btn-info btn-md mobi2">
                        Change Rack
                    </button>
                </div>
                    <div className="btn1">
                    <button onClick={this.props.onPass} type="button" className="btn btn-warning btn-md mobi2">
                        Pass
                    </button>
                    </div>
                    <hr/>
                    <div className="btn1">
                    <button onClick={this.props.onQuit} type="button" className="btn btn-danger btn-md mobi2">
                            New Game
                    </button>
                    </div>
                    </div>
            
                    <Component
                        changeWord= {this.changeWord.bind(this)}
                    />
            </div>
        );
    }
}

export default Move;