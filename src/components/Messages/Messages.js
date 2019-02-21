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
    isChannelStarred: false,
    usersRef: firebase.database().ref('users'),
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebase.database().ref('privateMessage'),
  }

  componentDidMount() {
    const { channel, user } = this.state;

    if(channel && user) {
      this.addListeners(channel.id);
      this.addUserStarListeners(channel.id, user.uid);
    }
  }

  addUserStarListeners = (channelId, userId) => {
    const { usersRef } = this.state;
    usersRef
    .child(userId)
    .child('starred')
    .once('value')
    .then(data => {
      if (data.val !== null) {
        const channelIds = Object.keys(data.val());
        const prevStarred = channelIds.includes(channelId);
        this.setState({ isChannelStarred: prevStarred })
      }
    })
  }

  handleStar = () => {
    this.setState(prevState => ({
      isChannelStarred: !prevState.isChannelStarred
    }), () => this.starChannel());
  }

  starChannel = () => {
    const { isChannelStarred, usersRef, user, channel } = this.state;
    if (isChannelStarred) {
      usersRef.child(`${user.uid}/starred`)
      .update({
        [channel.id]: {
          name: channel.name,
          details: channel.details,
          createdBy: {
            name: channel.createdBy.name,
            avatar: channel.createdBy.avatar,
          }
        }
      })
    } else {
      usersRef
      .child(`${user.uid}/starred`)
      .child(channel.id)
      .remove(err => {
        if (err !== null) {
          console.error(err);
        } 
      })
    }
  }

  getMessagesRef = () => {
    const { messagesRef, privateChannel, privateMessagesRef } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  }

  addListeners = channelId => {
    this.addMessageListener(channelId);
  }

  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref
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

  displayChannelName = channel => {
    return channel ? `${this.state.privateChannel ? '@' : '#' }${channel.name}` : '';
  };

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
    const { searchTerm, messagesRef, channel, user, messages, numUniqueUsers, searchResults, privateChannel, searchLoading, isChannelStarred } = this.state;
    return (
      <React.Fragment>
        <MessagesHeader 
          handleSearchChange={this.handleSearchChange} 
          channelName={this.displayChannelName(channel)} 
          numUniqueUsers={numUniqueUsers}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />
        <Segment>
          <Comment.Group className="messages">
            {searchTerm ? this.displayMessages(searchResults) : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessagesForm
          currentUser={user}
          messagesRef={messagesRef}
          currentChannel={channel}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef} 
        />
      </React.Fragment>
    )
  }
}
