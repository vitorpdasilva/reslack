import React, { Component } from 'react';
import moment from 'moment';
import { Comment, Image } from 'semantic-ui-react';

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? 'message__self' : null
}

const timeFromNow = timestamp => moment(timestamp).fromNow(); 
const isImage = (message) => {
  return message.hasOwnProperty('image');
}

const Message = ({ message, user }) => (
  <Comment>
    <Comment.Avatar src={message.user.avatar} />
    <Comment.Content className={isOwnMessage(message, user)}>
      <Comment.Author as="a" >{message.user.name}</Comment.Author>
      <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
    </Comment.Content>
    {isImage(message) ? <Image src={message.image} className="message__image" /> : <Comment.Text>{message.content}</Comment.Text> }
  </Comment>
);

export default Message;