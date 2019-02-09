import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import App from './components/App';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router, Switch, Route, withRouter } from 'react-router-dom';
import firebase from 'firebase';

class Root extends Component {
  
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        this.props.history.push('/');
      }
    })
  }
  
  render () {
    return (
      <Switch>
        <Route exact path="/" component={App}></Route>
        <Route path="/login" component={Login}></Route>
        <Route path="/register" component={Register}></Route>
      </Switch>
    )
  }
};

const RootWithAuth = withRouter(Root);

ReactDOM.render(
<Router>
  <RootWithAuth />
</Router>, document.getElementById('root'));
registerServiceWorker();
