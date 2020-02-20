import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import "./Nav.css";
// import axios from "axios";
// import auth from "../../utils/auth";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = { navigate: false };
    // this.handleSignout = this.handleSignout.bind(this);
  }

  handleSignout(e) {
    this.setState({ navigate: true });
    this.props.handleSignout(e);
  }

  render() {
    let navigate = this.state.navigate;
    if (navigate) {
      return <Redirect to="/login" push={true}></Redirect>;
    }
    return (
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>

          <li>
            <Link to="/account">Account</Link>
          </li>
          <li>
            <Link to="/read">Read</Link>
          </li>
          <li>
            <Link to="/" onClick={e => this.handleSignout(e)}>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    );
  }
}

export default Nav;
