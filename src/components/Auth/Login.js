import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import { Form, Grid, Segment, Button, Header, Icon, Message } from 'semantic-ui-react';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: [],
    loading: false,
  };
  
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

  submitHandler = event => {
    event.preventDefault();
    const { email, password, errors } = this.state;
    if (this.isFormValid(this.state)) {
      this.setState({ errors: [], loading: true });
      firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(signedUser => {
        console.log(signedUser);
      }).catch(err => {
        console.log(err);
        this.setState({ errors: errors.concat(err), loading: false });
      })
    }
  }

  isFormValid = ({ email, password }) => email && password

  render() {
    const { email, password, errors, loading } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h1" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Login for Reslack
          </Header>
          <Form onSubmit={this.submitHandler} size="large">
            <Segment stacked>
              <Form.Input fluid name="email" value={email} type="email" icon="mail" iconPosition="left" placeholder="email" onChange={this.handleChange} />
              <Form.Input fluid name="password" value={password} type="password" icon="lock" iconPosition="left" placeholder="password" onChange={this.handleChange} />
              <Button color="orange" disabled={loading} fluid size="large" className={loading ? 'loading' : null}>
                Submit
              </Button>
            </Segment>
          </Form>
          {errors.length > 0 && (
            <Message error>
              <h3>Error</h3>
              {this.displayErrors(errors)}
            </Message>
          )}
          <Message>Dont have an account ? <Link to="/register">register</Link></Message>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Login;