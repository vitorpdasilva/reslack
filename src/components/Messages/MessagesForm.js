import React, { Component } from 'react';
import firebase from '../../firebase';
import uuidv4 from 'uuid/v4';
import { Segment, Button, Input} from 'semantic-ui-react';
import FileModal from './FileModal';
import Progressbar from './ProgressBar';

class MessagesForm extends Component {
  
  state = {
    storageRef: firebase.storage().ref(),
    message: '',
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    errors: [],
    modal: false,
    uploading: '',
    uploadTask: null,
    percentUploaded: 0,
  };

  openModal = () =>  this.setState({ modal: true });
  closeModal = () =>  this.setState({ modal: false });
  

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  createMessage = (fileUrl = null) => {
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
    if (fileUrl !== null) {
      message['image'] = fileUrl;
    } else {
      message['content'] = this.state.message;
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

  uploadFile = (file, metadata) => {
    const { storageRef, errors } = this.state;
    const pathToUpload = this.state.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${uuidv4()}.jpg`;
    this.setState({ uploadState: 'uploading', uploadTask: storageRef.child(filePath).put(file, metadata) },
      () => {
        this.state.uploadTask.on('state_changed', snap => {
          const percentUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          this.setState({ percentUploaded })
        }, err => {
          console.log(err);
          this.setState({ errors: errors.concat(err), uploadTask: null, uploadState: 'error',  });
        }, () => {
          this.state.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.sendFileMessage(downloadURL, ref, pathToUpload);
          }).catch(err => {
            console.log('err', err);
            this.setState({ errors: errors.concat(err), uploadTask: null, uploadState: 'error',  });
          })
        })
      }
    )
  }

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: 'done' });
      }).catch(err => {
        this.setState({ errors: this.state.errors.concat(err) })
      })
  }

  render() {
    const { errors, message, loading, modal, uploadState, percentUploaded } = this.state;
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
          <Button color="teal" disabled={uploadState === 'uploading'} content="upload media" onClick={this.openModal} labelPosition="right" icon="cloud upload" />
        </Button.Group>
        <FileModal uploadFile={this.uploadFile} modal={modal} closeModal={this.closeModal} />
        <Progressbar uploadState={uploadState} percentUploaded={percentUploaded} />
      </Segment>
    )
  }
}

export default MessagesForm;
