import React, { Component } from 'react';
const axios = require('axios');
import PreviousOutfit from './PreviousOutfit';

class History extends Component {

  constructor(props) {
    super(props);
    this.state = {
      prevOutfits: []
    }

    this.handleDeletePrevOutfit = this.handleDeletePrevOutfit.bind(this)
  }

  componentDidMount() {
    console.log('in cdm History props', this.props);
   axios.get('/api/history/' + this.props.currentUser)
   .then(response => {
     console.log('response: ', response);
     this.setState ({
       prevOutfits: response.data
     })
   }).catch(error => {
     console.log(error, '- Get previous outfits');
   })
  }

  handleDeletePrevOutfit(prev) {
    this.setState({
      prevOutfits: prev
    })
  }

  render() {

    const prevOutfits = []
    // console.log(this.state.prevOutfits)
    if (this.state.prevOutfits.length > 0){
      this.state.prevOutfits.map((x, index) => {
        prevOutfits.push(<PreviousOutfit key={index} item={x} handleDeletePrevOutfit={this.handleDeletePrevOutfit} currentUser={this.props.currentUser}/>)
      })
    }

    return (
      <div>
        <div className="main-outfit">
        </div>
        <div className="previous-outfits">
          {prevOutfits}
        </div>
      </div>
    );
  }
}



export default History;
