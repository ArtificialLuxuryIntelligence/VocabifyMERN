import React, { Component } from "react";

class LanguageDropdown extends Component {
  // constructor(props) {
  //   super(props);
  //   // this.state = { lang: this.props.lang };
  // }

  render() {
    return (
      <select
        value={this.props.lang}
        onChange={this.props.handleDropdownChange}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
      </select>
    );
  }
}

export default LanguageDropdown;
