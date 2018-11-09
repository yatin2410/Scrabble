import React from 'react';
import './main.css';
import './bootstrap.css';

class Move extends React.Component{
    render(){
        return(
            <div  className="move">
                <form className="form">
                    <div className="form-group">
                        <label>Starting Position:</label>
                        <input type="text" className="form-control" placeholder="enter word" />
                        <small class="form-text text-muted">Please enter proper word...</small>
                    </div>
                    <button type="button" className="btn btn-primary btn-lg">
                        Place Word
                    </button> 
                </form>
                <div className="btn1">
                    <button type="button" className="btn btn-info btn-lg">
                        Change Rack
                    </button>
                </div>
                    <div className="btn1">
                    <button type="button" className="btn btn-warning btn-lg">
                        Pass
                    </button>
                    </div>
                    <div className="btn1">
                    <button type="button" className="btn btn-danger btn-lg">
                            Quit
                    </button>
                    </div>
            </div>
        );
    }
}

export default Move;