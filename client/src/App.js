import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import axios from 'axios';

import Header from './components/Header/';
import Brands from './components/Brands/';
import Articles from './components/Article/';
import Register from './components/Register/';
import Profile from './components/Profile/';
import Login from './components/Login/';

const SERVER_URL = 'https://sheltered-shore-90169.herokuapp.com';
// const SERVER_URL = 'http://localhost:3001'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brands: [],
      credentials: {
        user_name: '',
        password: '',
        email: '',
        first_name: '',
        last_name: '',
        token: '',
        comments: [],
        role_id: 3,

      },
      articleData: {
        isReady: false,
        article: null,
        sneaker: null,
        brand: null,
        comments: [],
      },
      loggedIn: false,
    }
  }

  onChange = (evt) => {
    const {name, value} = evt.target;
    this.setState(prevState => {
      return {
        ...prevState,
        credentials: {
          ...prevState.credentials,
          [name]: value,
        }
      }
    });
  }

  onDelete = async () => {
    if(this.state.credentials.user_name !== "anonymous") {
      const URL = `${SERVER_URL}/users/${this.state.credentials.user_name}`;
      const resp = await axios.delete({
        method: 'get',
        url: URL,
        headers: {
          Authorization: this.state.credentials.token,
        }
      });
      console.log(resp);
      this.onLogoff();
    }
  }

  onLogoff = () => {
    this.setState(prevState => {
      return {
        credentials: {
          user_name: '',
          password: '',
          email: '',
          first_name: '',
          last_name: '',
          token: '',
          comments: [],
          role_id: 3,
        },
        loggedIn: false,
      } });
  }

  onLogin = async (userData) => {
    const currentUsers =  await axios.post(`${SERVER_URL}/users/login`, userData);
    this.setState(prevState => {
      return {
        credentials: {
          ...prevState.credentials,
          password: '',
          token: `Bearer ${currentUsers.data.token}`,
        },
        loggedIn: true,
      } });
  }

  onRegister = async (userData) => {
    const newUsers =  await axios.post(`${SERVER_URL}/users`, userData);
    this.setState(prevState => {
      return {
        credentials: {
          ...prevState.credentials,
          password: '',
          token: `Bearer ${newUsers.data.token}`,
        },
        loggedIn: true,
      }
    })
  }

  getProfile = async () => {
    const URL = `${SERVER_URL}/users/profile`;
    const resp = await axios({
      method: 'get',
      url: URL,
      headers: {
        Authorization: this.state.credentials.token,
      }
    });
    const userComments = resp.data.comments;
    this.setState(prevState => {
      return {
      credentials: {
        ...prevState.credentials,
        ...resp.data.user,
        password: '',
        comments: userComments,
      }}
    })
  }

  onSubmitReg = async (evt) => {
    evt.preventDefault();
    await this.onRegister(this.state.credentials)
  }

  onSubmitLog = async (evt) => {
    evt.preventDefault();
    await this.onLogin(this.state.credentials)
    await this.getProfile();
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          {/* Homepage */}
          <Route exact path='/' render={
            () => {
              return (
                <img className='logo' src='/resources/logo.png' alt='SneakerCritic' />
              )
            }
          }/>
          {/* Articles */}
          <Route
            path='/articles'
            render={
              (props) => <Articles {...props} server_url={SERVER_URL} credentials={this.state.credentials} />
            }
          />
          {/* Brands */}
          <Route
            path='/brands'
            render={
              (props) => <Brands {...props} server_url={SERVER_URL} />
            }
          />
          {/* Login */}
          <Route
            exact path='/login'
            render={(props) =>
              <Login {...props} onChange={this.onChange} onSubmit={this.onSubmitLog} credentials={this.state.credentials} />
            }
          />
          {/* Account */}
          <Route exact path='/profile' render={(props) => <Profile isLogedin={this.state.loggedIn} onChange={this.onChange} {...props} credentials={this.state.credentials} onDelete={this.onDelete} onLogoff={this.onLogoff}/>}/>
          {/* Register */}
          <Route exact path={'/register'}
            render={
              (props) => {
                return (
                  <Register
                    {...props}
                    onChange={this.onChange}
                    onSubmit={this.onSubmitReg}
                    credentials={this.state.credentials}
                  />
                )
              }
            }
          />
        </Switch>
      </div>
    );
  }
}

export default App;
