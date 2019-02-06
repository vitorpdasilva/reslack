import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { Form, Grid, Segment, Button, Header, Icon, Message } from 'semantic-ui-react';

class Register extends Component {
  state = {};
  
  handleChange = () => {

  }
  render() {
    return (
      <Grid textAlign="center" verticalAlign="middle" className="app">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" icon color="orange" textAlign="center">
            <Icon name="puzzle piece" color="orange" />
            Register for Reslack
          </Header>
          <Form size="large">
            <Segment stacked>
              <Form.Input fluid name="username" type="text" icon="user" iconPosition="left" placeholder="username" onChange={this.handleChange} />
              <Form.Input fluid name="email" type="email" icon="mail" iconPosition="left" placeholder="email" onChange={this.handleChange} />
              <Form.Input fluid name="password" type="password" icon="lock" iconPosition="left" placeholder="password" onChange={this.handleChange} />
              <Form.Input fluid name="passwordConfirmation" type="password" icon="repeat" iconPosition="left" placeholder="password confirmation" onChange={this.handleChange} />
              <Button color="orange" fluid size="large">
                Submit
              </Button>
            </Segment>
          </Form>
          <Message>Already a user? <Link to="/login">Login</Link></Message>
        </Grid.Column>

      </Grid>
    )
  }
}

export default Register;