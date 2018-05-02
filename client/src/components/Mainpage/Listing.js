import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import axios from 'axios';
class Listing extends Component {

    constructor(props) {
        super(props);
        this.state={
            user:null
        }

        axios.get('https://craigslistbackend.herokuapp.com/api/current_user')
        .then((user)=>{this.setState({user:user.data})})
        this.deleteHandler = this.deleteHandler.bind(this);
    }
    
    deleteHandler(e){
        axios.delete('https://craigslistbackend.herokuapp.com/api/postdelete/'+this.props.listing._id)
        .then((res)=>{
            this.props.pageRefresh();
        })
    }
    render() {
        var listing = this.props.listing;
        return (
            
           <div className="card">
                <h5 className="card-header">{listing.title} </h5>
                <div className="card-body">
                    <h5 className="card-title">posted by {listing.user.firstname}</h5>
                    <p className="card-text">{listing.description}</p>
                    <Link to={'/listing/'+listing._id} className="btn btn-sm btn-primary">More details..</Link>
                    {this.state.user && this.state.user._id===listing.user._id && <p className='btn btn-warning btn-sm' name={listing._id} onClick={() => { if (window.confirm('Are you sure you wish to delete this post?')) this.deleteHandler() } } >Delete</p> }
                </div>
            </div>
        );
    }
}

export default Listing;
