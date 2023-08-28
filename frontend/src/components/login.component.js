import React, { Component } from 'react';
import './login-signup.css';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const { email, password } = this.state;
    fetch('http://localhost:5000/login', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        email,
        password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, 'adminLogin');
        if (data.status == 'ok') {
          window.location.href = './dashboard';
        } else {
          alert('Invalid admin');
        }
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3 className='heading'>Log in</h3>
        <div className='item'>
          <label>Email address: </label>
          <input
            type='email'
            className='input'
            placeholder='Enter email'
            onChange={(e) => this.setState({ email: e.target.value })}
          />
        </div>
        <div className='item'>
          <label>Password: </label>
          <input
            type='password'
            className='input'
            placeholder='Enter password'
            onChange={(e) => this.setState({ password: e.target.value })}
          />
        </div>
        <div className='item'>
          <input type='checkbox' />
          <label>Remember me</label>
        </div>
        <div className='item'>
          <button type='submit'>Submit</button>
        </div>
      </form>
    );
  }
}