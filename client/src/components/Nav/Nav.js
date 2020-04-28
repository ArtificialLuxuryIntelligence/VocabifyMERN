import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import "./Nav.scss";
// import axios from "axios";
// import auth from "../../utils/auth";

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = { navigate: false, navOpen: false };

    // this.handleSignout = this.handleSignout.bind(this);
  }

  render() {
    let navigate = this.state.navigate;
    if (navigate) {
      return <Redirect to="/login" push={true}></Redirect>;
    }
    return (
      <nav className={this.state.navOpen ? "nav-open" : ""}>
        <span>
          <h1>Vocabify</h1>
        </span>
        <div onClick={() => this.toggleNav()} className="mobile-menu-toggle">
          <div id="hamburger">
            <span></span>
          </div>
        </div>
        <ul>
          <li className="nav-item">
            <Link to="/">Home</Link>
          </li>

          <li className="nav-item">
            <Link to="/account">Account</Link>
          </li>
          <li className="nav-item">
            <Link to="/read">Read</Link>
          </li>
          <li className="nav-item">
            <Link to="/" onClick={(e) => this.handleSignout(e)}>
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  handleSignout(e) {
    this.setState({ navigate: true });
    this.props.handleSignout(e);
  }

  toggleNav() {
    this.setState({ navOpen: !this.state.navOpen });
  }
}

export default Nav;
