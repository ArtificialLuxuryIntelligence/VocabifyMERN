import React, { Component } from 'react';
import './Signin.scss';

import axios from 'axios';
import auth from '../../utils/auth';

class Signin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      token: '',
      signInEmail: '',
      signInPassword: '',
      signUpEmail: '',
      signUpPassword: '',
      currentView: 'signIn',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.addToAppState = this.props.addToAppState;
  }

  render() {
    return <div className="signin">{this.currentView()}</div>;
  }

  currentView = () => {
    switch (this.state.currentView) {
      case 'signUp':
        return (
          <form>
            <h2>Welcome to Vocabify!</h2>
            <fieldset>
              <legend>Sign up</legend>
              <p>{this.state.message}</p>

              <ul>
                <li>
                  <label>Username:</label>
                  <input
                    value={this.state.signUpEmail}
                    onChange={this.handleChange}
                    name="signUpEmail"
                    type="text"
                    required
                  />
                </li>
                <li>
                  <label>Password:</label>
                  <input
                    value={this.state.signUpPassword}
                    onChange={this.handleChange}
                    name="signUpPassword"
                    type="password"
                    required
                  />
                </li>
              </ul>
            </fieldset>
            <button onClick={(e) => this.handleSignUp(e)}>Sign up</button>
            <button type="button" onClick={() => this.changeView('signIn')}>
              Have an account?
            </button>
          </form>
        );
      // break;
      case 'signIn':
        return (
          <form>
            <h2>Welcome to Vocabify!</h2>
            <fieldset>
              <legend>Log In</legend>
              <p>{this.state.message}</p>
              <ul>
                <li>
                  <label>Username:</label>
                  <input
                    value={this.state.signInEmail}
                    onChange={this.handleChange}
                    name="signInEmail"
                    type="text"
                    required
                  />
                </li>
                <li>
                  <label>Password:</label>
                  <input
                    value={this.state.signInPassword}
                    onChange={this.handleChange}
                    name="signInPassword"
                    type="password"
                    required
                  />
                </li>
              </ul>
            </fieldset>
            <button onClick={(e) => this.handleSignIn(e)}>Login</button>
            <button
              type="button"
              onClick={() => {
                this.changeView('signUp');
              }}
            >
              Create an Account
            </button>
          </form>
        );
      // break;
      default:
        break;
    }
  };

  async componentDidMount() {
    //check to see if already logged in (
    // [using (less supported) null propogation operator)
    // if (localStorage.getItem("vocabify")?.token) {
    // }]

    if (
      localStorage.getItem('vocabify') &&
      JSON.parse(localStorage.getItem('vocabify')).token
    ) {
      let token = JSON.parse(localStorage.getItem('vocabify')).token;
      let headers = {
        'Content-Type': 'application/json',
        Authorization: `bearer ${token}`,
      };

      let res = await axios.post('/users/authcheck', null, { headers });
      if (res.status === 200) {
        this.props.history.push('/');
      }
    }
  }

  changeView = (view) => {
    this.setState({
      currentView: view,
      message: '',
    });
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleSignIn(e) {
    e.preventDefault();
    const { signInEmail, signInPassword } = this.state;
    const { history } = this.props;

    let obj = { email: signInEmail, password: signInPassword };

    axios
      .post('/users/signin', obj)
      .then((res) => {
        if (res.data.success) {
          auth.loggingIn();
          // console.log(res.data);

          let { token, vocabSize, lang, words } = res.data;

          //setting App state
          // this.addToAppState("token", token);
          // this.addToAppState("knownWords", knownWords); // to be removed
          // this.addToAppState("unknownWords", unknownWords); // to be removed
          this.addToAppState('vocabSize', vocabSize);
          this.addToAppState('lang', lang);
          this.addToAppState('words', words);
          //

          //setting local storage ----
          const local = JSON.parse(localStorage.getItem('vocabify')) || {};
          local.token = token;
          // local.knownWords = knownWords;
          // local.unknownWords = unknownWords;
          local.vocabSize = vocabSize;
          local.lang = lang;
          local.words = words;
          localStorage.setItem('vocabify', JSON.stringify(local));
          // --------------------------
          history.push('/');
          //example of passing data
          // history.push("/", { passedData: "I am the from the login page" });

          // console.log(localStorage);
        } else {
          this.setState({ message: res.data.message });
          // console.log(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  }

  handleSignUp(e) {
    e.preventDefault();
    const { signUpEmail, signUpPassword } = this.state;

    let obj = { email: signUpEmail, password: signUpPassword };
    // console.log(obj);

    axios
      .post('/users/signup', obj)
      .then((res) => {
        // console.log(res.data);

        if (res.data.success === true) {
          // console.log("SUCCESS");
          this.setState({ currentView: 'signIn', message: '' });
        } else {
          this.setState({ message: res.data.message });

          // console.log(res.data.message);
        }
      })
      .catch((err) => console.log(err));
  }
}

export default Signin;
