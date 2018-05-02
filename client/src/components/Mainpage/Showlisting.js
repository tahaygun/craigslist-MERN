import React, { Component } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
class Showlisting extends Component {
    constructor(props) {
        super(props);
        this.state={
            data:null,
            isLoggedIn:true
        }
        axios.get(`https://infinite-sea-90747.herokuapp.com/api/showOne/${this.props.match.params.listingId}`)
        .then((data)=>{this.setState({data:data.data})});
        axios.get('https://infinite-sea-90747.herokuapp.com/api/isloggedin')
        .then((user)=>{this.setState({isLoggedIn:user.data})})
    }
    
    render() {
        var listing = this.state.data;
        return (
            !this.state.isLoggedIn ? <Redirect to='/'/> :

            (this.state.data &&
            <div className="card text-center">
                <div className="card-body">
                    <h5 className="card-title">{listing.title}</h5>
                    <p className="card-text"><b>Description:</b> {listing.description}</p>
                    <p className="card-text btn-sm"> <b>Location:</b> {listing.location}</p>
                    <p className="card-text btn-sm"> <b>Contact:</b> {listing.contact}</p>
                </div>
                <div className="card-footer text-muted"> at {(listing.createdAt).slice(0,10)} by {listing.user.firstname}</div>
                <Link style={{width:'200px', margin:'auto'}} className='btn btn-warning btn-sm' to='/mainpage' > Back</Link>
            </div>)
        );
    }
}

export default Showlisting;
