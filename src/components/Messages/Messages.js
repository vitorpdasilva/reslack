import React, { Component } from 'react';
import firebase from '../../firebase';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';

export default class Messages extends Component {
  
  state = {
    channel: this.props.currentChannel,
    messagesRef: firebase.database().ref('messages'),
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    numUniqueUsers: '',
  }

  componentDidMount() {
    const { channel, user } = this.state;

    if(channel && user) {
      this.addListeners(channel.id);
    }
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  }

  addMessageListener = channelId => {
    const { messagesRef } = this.state;
    let loadedMessages = [];
    messagesRef
      .child(channelId)
      .on('child_added', snap => {
        loadedMessages.push(snap.val());
        this.setState({ messages: loadedMessages, messagesLoading: false })
      })
    this.countUniqueUsers(loadedMessages);
  }

  displayMessages = messages => (
    messages.length > 0 && messages.map(message => (
      <Message key={message.timestamp} message={message} user={this.state.user} />
    ))
  )

  displayChannelName = channel => channel ? `#${channel.name}` : null;
  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, [])
    const numUniqueUsers = `${uniqueUsers.length} users`;
    this.setState({ numUniqueUsers });
  }

  render() {
    const { messagesRef, channel, user, messages, numUniqueUsers } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader channelName={this.displayChannelName(channel)} numUniqueUsers={numUniqueUsers} />
        <Segment>
          <Comment.Group className="messages">
            {this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessagesForm currentUser={user}  messagesRef={messagesRef} currentChannel={channel} />
      </React.Fragment>
    )
  }
}
