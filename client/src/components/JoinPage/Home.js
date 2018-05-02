import React, { Component } from 'react';
import Login from './Login';
import Register from './Register';
// import axios from 'axios';
export default class Home extends Component {  
  render() {
    return (
      <div>
        <h3 className='header' >Welcome to LinkedIn</h3>
        <Login history={this.props.history} />
        <br/>
        <Register/>
      </div>
    )
  }
}
