import React, { Component } from 'react'

class LabeledInput extends Component {

  render() {

    return (
      <div>
        <p>{this.props.label}</p>
        <input 
          type={this.props.hidden ? "password" : "text"} 
          value={this.props.value}
          onChange={(event) => this.props.updateValue(event.target.value)}
        />
      </div>
    )
  }
}

export default LabeledInput