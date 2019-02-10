import React, { Component } from 'react';
import firebase from '../../firebase';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm'

export default class Messages extends Component {
  
  state = {
    channel: this.props.currentChannel,
    messagesRef: firebase.database().ref('messages'),
    user: this.props.currentUser,
  }

  render() {
    const { messagesRef, channel, user } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader />
        <Segment>
          <Comment.Group className="messages" />
        </Segment>
        <MessagesForm currentUser={user}  messagesRef={messagesRef} currentChannel={channel} />
      </React.Fragment>
    )
  }
}
