import React, { Component } from 'react'
import axios from 'axios';
export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state={
      data:{
        firstname:'', 
        lastname:'',
        email:'',
        password:'',
      },
      errors:null
    }
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }
  
  submitHandler(e){
    e.preventDefault();
    axios.post("https://craigslistbackend.herokuapp.com/api/register", this.state.data).then((res)=>{
      if(res.data.errors){
        console.log(res.data.errors);
       return this.setState({errors:res.data.errors})
      }
      if(res.data.ok){
        return this.setState({error:"Succesfully registerated", errors:null})
      }
      console.log(res);
    });
  }

  changeHandler(e){
    var formData = this.state.data;
    formData[e.target.name] = e.target.value;
    this.setState({
        data : formData
    })
  }

  render() {
    return (
      <div>
        <h3>Register</h3>
        {this.state.error &&<p className="btn-danger" >{this.state.error}</p>}
      <form onSubmit={this.submitHandler}>
        <div className="row">
            <div className="col">
              <input type="text" onChange={this.changeHandler} name='firstname' className="form-control" value={this.state.data.firstname} placeholder="Firstname"/>
              {this.state.errors && this.state.errors.firstname && <p className="text-danger"> {this.state.errors.firstname.msg}</p>}
            
          </div>
          <div className="col">
                <input type="text" onChange={this.changeHandler} name='lastname' className="form-control" value={this.state.data.lastname} placeholder="Last Name"/>
              {this.state.errors && this.state.errors.lastname && <p className="text-danger"> {this.state.errors.lastname.msg}</p>}        
          </div>
        </div>
        <div className="row">
            <div className="col">
            <input type="email" onChange={this.changeHandler} name='email' className="form-control" value={this.state.data.email} placeholder="Email"/>
              {this.state.errors && this.state.errors.email && <p className="text-danger"> {this.state.errors.email.msg}</p>}
          </div>
          <div className="col">
              <input type="password" onChange={this.changeHandler} name='password' className="form-control" value={this.state.data.password} placeholder="Password"/>
              {this.state.errors && this.state.errors.password && <p className="text-danger"> {this.state.errors.password.msg}</p>}
          </div>
        </div>
        <button type='submit' className="btn btn-primary">Submit</button>
      </form>
      </div>
    )
  }
}
