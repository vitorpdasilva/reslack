import React, { Component } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Menu, Icon, Modal, Form, Button, Input } from 'semantic-ui-react';

class Channels extends Component {
  
  state = {
    activeChannel: '',
    user: this.props.currentUser,
    channels: [],
    modal: false,
    channelName: '',
    channelDetails: '',
    channelsRef: firebase.database().ref('channels'),
    firstLoad: true,
  }

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.channelsRef.off();
  }

  addListeners = () => {
    const { channelsRef } = this.state;
    let loadedChannels = [];
    channelsRef.on('child_added', snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setDefaultChannel())
    })
  }

  setDefaultChannel = () => {
    const { firstLoad, channels } = this.state;
    if(firstLoad && channels.length > 0) {
      this.props.setCurrentChannel(channels[0])
      this.setActiveChannel(channels[0]);
    }
    this.setState({ firstLoad: false });
  }

  closeModal = () => {
    this.setState({ modal: false });
  }

  openModal = () => {
    this.setState({ modal: true });
  }

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addChannel();
    } 
  }

  isFormValid = ({ channelName, channelDetails }) => channelName && channelDetails; 

  addChannel = () => {
    const { user, channelsRef, channelName, channelDetails } = this.state;
    const key = channelsRef.push().key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
        uid: user.uid,
      }
    }

    channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: '', channelDetails: '' });
        this.closeModal();
      }).catch(err => {
        console.log(err);
      })
  }

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  }

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  }

  displayChannels = channels =>
    channels.length > 0 && 
    channels.map(channel => (
      <Menu.Item 
        key={channel.id} 
        onClick={() => this.changeChannel(channel)} 
        name={channel.name} 
        active={channel.id === this.state.activeChannel}
        style={{ opacity: .7 }}>
        # {channel.name}
      </Menu.Item>
    ));

  render() {
    const { channels, modal } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" />CHANNELS&nbsp;
            </span>
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {this.displayChannels(channels)}
        </Menu.Menu>
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input fluid label="Name of Channel" name="channelName" onChange={this.handleChange} />
              </Form.Field>
              <Form.Field>
                <Input fluid label="Details of Channel" name="channelDetails" onChange={this.handleChange} />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark"></Icon>Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove"></Icon>Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(Channels);
