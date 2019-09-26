import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import styles from "../index.css";
const axios = require('axios');
import Outfit from './Outfit';
import History from './History';
import List from './List';
import FeaturedOutfit from './FeaturedOutfit';
import Select from 'react-select';
import Login from './Login';
import SignUp from './SignUp';


const options = [
  { value: 'cold', label: 'Cold' },
  { value: 'hot', label: 'Hot' },
];

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      outfits: [],
      selected: false,
      weather: null,
      todaysOutfit: [],
      currentUser: "",
      loggedIn: false,
      rerender: false,
      isHomeClicked: true,
      isHistoryClicked: false,
      isListClicked: false  
    }

    this.handleWeather = this.handleWeather.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.homeIsClicked = this.homeIsClicked.bind(this);
    this.listIsClicked = this.listIsClicked.bind(this);
    this.historyIsClicked = this.historyIsClicked.bind(this);
  }

  componentDidUpdate() {
    if(this.state.rerender) {
      // When component mounts, check if there is a current browser session. If there is not, redirect user to
      // sign in page (which has a link to sign up). If there is a session, the following logic holds true:
      axios.get('')

      // When component mounts, set today's outfit
      axios.get('/api/outfits/today/' + this.state.currentUser)
      .then(response => {
        this.setState ({
          selected: response.data.today,
          todaysOutfit: response.data.outfit,
          rerender: false
        })
      }).catch(error => {
        console.log(error, '- Check current date outfit exists');
      })

      // Check if today's outfit is selected, change select state to true. 
      // This allows a user to see todays oufit.
      if (!this.state.selected) {
        axios.get('/api/outfits/' + this.state.currentUser)
        .then(response => {
          this.setState ({
            outfits: response.data,
            rerender: false
          })
        }).catch(error => {
          console.log(error, '- Get outfit selections');
        })
        }
      }
    }

  // reassigns 'weather' in state from 'null' to whatever the user has selected, 
  // then filters outfits based on whether they are suited to today's weather.
  handleWeather(weather) {
    this.setState({ weather });
    axios.post('/api/filterOutfits', {
      weather: weather,
      user: this.state.currentUser
    })
    .then(response => {
      this.setState ({
        outfits: response.data
      })
    }).catch(error => {
      console.log(error, '- Cant filter weather on outfits');
    })
  }

  //checks if username and password match those stored in DB
  authenticate(username, password) { 
    // post req to /login database with username and password
    axios.post('/login', {username, password})
    .then((res)=> {
      if(res.data === 'verified') {
        this.setState({
          currentUser: username, 
          loggedIn: true, 
          rerender: true
        });
      }  
    })
    .catch((err) => {
      console.log(err);
    })
  }

  homeIsClicked(e) {
    e.preventDefault();
    this.setState({
      isHomeClicked: true,
      isListClicked: false,
      isHistoryClicked: false
    });
  }
  
  listIsClicked(e) {
    e.preventDefault();
    this.setState({
      isHomeClicked: false,
      isListClicked: true,
      isHistoryClicked: false
    });
  }
  
  historyIsClicked(e) {
    e.preventDefault();
    this.setState({
      isHomeClicked: false,
      isListClicked: false,
      isHistoryClicked: true
    });
  }
  
  render(){ 
      // if loggedIn is false, return login page
      if(!this.state.loggedIn) {
        return (
          <div>
            <Login authenticate={this.authenticate}/>
          </div>
        )
      }

    if(this.state.isListClicked) {
      return (
        <div>
          <button onClick={this.homeIsClicked}>Home</button>
          <button onClick={this.listIsClicked}>List</button>
          <button onClick={this.historyIsClicked}>History</button>
          <List currentUser={this.state.currentUser} />
        </div>
      )
    }

    if(this.state.isHistoryClicked) {
      return (
        <div>
          <button onClick={this.homeIsClicked}>Home</button>
          <button onClick={this.listIsClicked}>List</button>
          <button onClick={this.historyIsClicked}>History</button>
          <History currentUser={this.state.currentUser} />
        </div>
      )
    }

    const { weather } = this.state;
      // As long as there are outfits in the outfits array, 
      // iterate through the array and create an outfit component for each outfit.
      const outfits = [];
      if(this.state.outfits.length > 0){
        this.state.outfits.map((x, index) => {
          outfits.push(<Outfit key={index} item={x} selected={this.state.selected} currentUser={this.state.currentUser} />)
        })
      }
    
      // custom styling for dropdown box
      const customStyles = {
        control: (base, state) => ({
          ...base,
          '&:hover': { borderColor: 'gray' },
            border: '1px solid lightgray',
            boxShadow: 'none',
        }),
        option: (base, state) => ({
          ...base,
          '&': {
              backgroundColor: 'transparent',
          }, color: 'black'
        })
      };
      
    return (
      <div>
        <button onClick={this.homeIsClicked}>Home</button>
        <button onClick={this.listIsClicked}>List</button>
        <button onClick={this.historyIsClicked}>History</button>
        <div>
          { this.state.selected ? (
            <div>
            <h1 className="featured-text">Today's outfit has already been selected</h1>
            <FeaturedOutfit item={this.state.todaysOutfit[0]} selected={this.state.selected} />
            </div>
          ) : (
            <div>
              <h1>Select an outfit</h1>
              <div className="container">
                <div className="select-weather">
                    <Select
                      value={weather}
                      onChange={this.handleWeather}
                      options={options}
                      styles={customStyles}
                    />
                </div>
                <div className="outfits-container">
                  {outfits}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default App;
