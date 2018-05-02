import React, { Component } from 'react';
import Listing from './Listing';
import axios from 'axios';
import Nav from './Nav';
import { Redirect } from 'react-router-dom';
class Main extends Component {
    constructor(props) {
        super(props);
        this.state={
            listings:null,
            isLoggedIn:true            
        }
         axios.get('http://localhost:8000/api/isloggedin')
          .then((user)=>{this.setState({isLoggedIn:user.data})})
        this.getPostings = this.getPostings.bind(this);
    this.logoutHandler = this.logoutHandler.bind(this);     
    this.pageRefresh = this.pageRefresh.bind(this);   
    }
    getPostings(){
        axios.get('http://localhost:8000/api/showlistings')
        .then((listings)=>{
            this.setState({listings:listings.data})
        })
    }

    componentDidMount(){
        this.getPostings();
    }
    logoutHandler(){
        axios.get('http://localhost:8000/api/logout')
        .then((answer)=>{this.setState({isLoggedIn:false})})
      }
      pageRefresh(){
          this.getPostings();
      }
    render() {
        return (
            !(this.state.isLoggedIn) ? <Redirect to='/'/> :
            <div>
            <Nav logoutHandler={this.logoutHandler} />
              
                {this.state.listings && this.state.listings.map((listing)=>{
                    return(
                        <Listing pageRefresh={this.pageRefresh} key={listing._id} listing={listing} />
                    )
                })}
                </div>
        );
    }
}

export default Main;
