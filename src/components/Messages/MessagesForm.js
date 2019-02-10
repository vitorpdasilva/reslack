import React, { Component } from 'react';
import firebase from '../../firebase';
import { Segment, Button, Input} from 'semantic-ui-react';

class MessagesForm extends Component {
  
  state = {
    message: '',
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: [],
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  createMessage = () => {
    const { user } = this.state;
    const message = {
      content: this.state.message,
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
      }
    }
    return message;
  }

  sendMessage = () => {
    const { messagesRef } = this.props;
    const { message, channel, errors } = this.state;

    if(message) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: '', errors: [], })
        }).catch(err => {
          console.log(err);
          this.setState({ errors: errors.concat(err) })
        })
    } else {
      this.setState({  
        errors: errors.concat({ message: 'Add a message...' })
      });
    }
  }

  render() {
    const { errors, message, loading } = this.state;
    return (
      <Segment className="message__form">
        <Input 
          fluid
          disabled={loading}
          value={message}
          name="message" 
          style={{ marginBottom: '.7em' }} 
          label={<Button icon={"add"} />}
          labelPosition="left"
          placeholder="write your message"
          onChange={this.handleChange}
          className={errors.some(error =>
            error.message.includes('message')) ? 'error' : null
          }
        />
        <Button.Group icon widths="2">
          <Button color="orange" content="add Reply" onClick={this.sendMessage} labelPosition="left" icon="edit" />
          <Button color="teal" content="upload media" labelPosition="right" icon="cloud upload" />
        </Button.Group>
      </Segment>
    )
  }
}

export default MessagesForm;
