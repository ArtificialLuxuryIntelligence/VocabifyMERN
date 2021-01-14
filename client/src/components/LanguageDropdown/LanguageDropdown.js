import React, { Component } from 'react';
import './LanguageDropdown.scss';

class LanguageDropdown extends Component {
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
