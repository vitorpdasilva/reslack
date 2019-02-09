import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import firebase from 'firebase';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducers';
import { setUser } from './actions';
import Spinner from './Spinner';

const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {
  
  componentDidMount() {
    console.log(this.props.isLoading)
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.props.setUser(user);
        this.props.history.push('/');
      }
    })
  }
  
  render () {
    return this.props.isLoading ? <Spinner /> : (
      <Switch>
        <Route exact path="/" component={App}></Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
      </Switch>
    )
  }
};

const mapStateFromProps = state => ({
  isLoading: state.user.isLoading
})

const RootWithAuth = withRouter(connect(mapStateFromProps, { setUser })(Root));

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <RootWithAuth />
    </Router>
  </Provider>, document.getElementById('root'));
registerServiceWorker();
