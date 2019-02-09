import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import { Form, Grid, Segment, Button, Header, Icon, Message } from 'semantic-ui-react';

class Register extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    errors: [],
    loading: false,
  };
  
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value })
  }

  displayErrors = errors => errors.map((error, i) => <p key={i}>{error.message}</p>)

  isFormValid = () => {
    let errors = [];
    let error;
    if(this.isFormEmpty(this.state)) {
      error = { message: 'Fill all fields' };
      this.setState({ errors: errors.concat(error) });
      return false;
    } else if (!this.isPasswordValid(this.state)) {
        error = { message: 'Password isnt valid'};
        this.setState({ errors: errors.concat(error) });
        return false;
    } else {
      return true;
    }
  }

  isFormEmpty = ({username, email, password, passwordConfirmation}) => {
    return !username.length || !email.length || !password.length || !passwordConfirmation.length; 
  }

  isPasswordValid = ({ password, passwordConfirmation }) => {
    if (password.length < 6 || passwordConfirmation.length < 6) {
      return false;
    } else if (password !== passwordConfirmation) {
      return false;
    } else {
      return true;
    }
  }

  submitHandler = event => {
    event.preventDefault();
    const { email, password, errors } = this.state;
    if (this.isFormValid()) {
      this.setState({ errors: [], loading: true });
      firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(createdUser => {
        console.log(createdUser);
        this.setState({ loading: false })
      }).catch(err => {
        console.log(err);
        this.setState({ errors: errors.concat(err), loading: false })
      })
    }
  }

  render() {
    const { username, email, password, passwordConfirmation, errors, loading } = this.state;
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for Reslack
          </Header>
          <Form onSubmit={this.submitHandler} size="large">
            <Segment stacked>
              <Form.Input fluid name="username" value={username} type="text" icon="user" iconPosition="left" placeholder="username" onChange={this.handleChange} />
              <Form.Input fluid name="email" value={email} type="email" icon="mail" iconPosition="left" placeholder="email" onChange={this.handleChange} />
              <Form.Input fluid name="password" value={password} type="password" icon="lock" iconPosition="left" placeholder="password" onChange={this.handleChange} />
              <Form.Input fluid name="passwordConfirmation" value={passwordConfirmation} type="password" icon="repeat" iconPosition="left" placeholder="password confirmation" onChange={this.handleChange} />
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
          <Message>Already a user? <Link to="/login">Login</Link></Message>
        </Grid.Column>

      </Grid>
    )
  }
}

export default Register;