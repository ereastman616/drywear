import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import LabledInput from './LabeledInput'
import Button from './Button'
import styles from "../index.css";
const axios = require('axios');


class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    }
    this.setUsername = this.setUsername.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  // updates username in state to what the user has typed
  setUsername(value) {
    this.setState({ username: value })
  }

  // updates password in state to what the user has typed
  setPassword(value) {
    this.setState({ password: value })
  }

  render() {
    // render logic (custom styles?)
    // if user is logged in, redirect to home page
    // if (loggedIn) {
    //   return <Redirect to="/home" />
    // } else {
        return (
        <div>
          <h1 className="featured-text">Log in</h1>
          <LabledInput
            label="Username"
            value={this.state.username}
            updateValue={this.setUsername}
          />
          <LabledInput
            hidden
            label="Password"
            value={this.state.password}
            updateValue={this.setPassword}
          />
          <Button
            title="Log in"
            onClick={this.props.authenticate}
            username={this.state.username}
            password={this.state.username}
          />
        </div>
      )

    }

  };

export default Login;