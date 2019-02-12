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
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
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

  handleSearchChange = event => {
    this.setState({ 
      searchTerm: event.target.value, 
      searchLoading: true 
    }, () => this.handleSearchMessages());
  }

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = channelMessages.reduce((acc, message) => {
      if (message.content && message.content.match(regex) || message.user.name.match(regex)) {
        acc.push(message);
      }
      return acc;
    }, [])
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  }

  render() {
    const { searchTerm, messagesRef, channel, user, messages, numUniqueUsers, searchResults } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader 
          handleSearchChange={this.handleSearchChange} 
          channelName={this.displayChannelName(channel)} 
          numUniqueUsers={numUniqueUsers} 
        />
        <Segment>
          <Comment.Group className="messages">
            {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessagesForm currentUser={user}  messagesRef={messagesRef} currentChannel={channel} />
      </React.Fragment>
    )
  }
}
