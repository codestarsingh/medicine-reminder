import React, { Component } from 'react';
import './login-signup.css';

export default class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: ''
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    const { name, email, password } = this.state;
    fetch('http://localhost:5000/signup', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        name,
        email,
        password
      })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, 'adminSignup');
        if (data.status == 'ok') {
          alert('Signup successful');
          window.location.href = './';
        }
      });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h3 className='heading'>Sign up</h3>
        <div className='item'>
          <label>Name: </label>
          <input
            type='Enter name'
            className='input'
            placeholder='Name'
            onChange={(e) => this.setState({ name: e.target.value })}
          />
        </div>
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
          <button type='submit'>Signup</button>
        </div>
      </form>
    );
  }
}