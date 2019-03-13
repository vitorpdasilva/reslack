import React, { Component } from 'react';
import firebase from '../../firebase';
import { Grid, Header, Icon, Dropdown, Image, Modal, Button, Input } from 'semantic-ui-react';

class UserPanel extends Component {

  state = {
    user: this.props.currentUser,
    modal: false,
  }
  
  dropDownOptions = () => [
    { key: 'user', text: <span>Signed in as <strong>{this.state.user && this.state.user.displayName}</strong></span>, disabled: true },
    { key: 'avatar', text: <span onClick={this.openModal}>Change Avatar</span> },
    { key: 'signout', text: <span onClick={this.handleSingout}>Sign out</span> }
  ];

  handleSingout = () => {
    firebase
    .auth()
    .signOut()
    .then(() => console.log('signed out'));
  }

  openModal = () => this.setState({ modal: true });

  closeModal = () => this.setState({ modal: false })

  render() {
    const { user, modal } = this.state;
    return (
      <Grid style={{ background: '#4c3c4c' }}>
        <Grid.Column>
          <Grid.Row style={{ padding: '1.2em', margin: 0 }}>
            <Header inverted float="left" as="h2">
              <Icon name="code" />
              <Header.Content>
                Reslack
              </Header.Content>
            </Header>
          </Grid.Row>
          <Header style={{ padding: '.25em' }} as="h4" inverted>
            <Dropdown trigger={
              <span>
                <Image src={user.photoURL} spaced="right" avatar />
                {user.displayName}
              </span>
            } options={this.dropDownOptions()}

            />
          </Header>
          <Modal basic open={modal} onClose={this.closeModal}>
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input fluid type="file" label="new avatar" name="preview image" />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className="ui center aligned grid">

                  </Grid.Column>
                  <Grid.Column>

                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              <Button color="green" inverted>
                <Icon name="save" />Change Avatar
              </Button>
              <Button color="green" inverted>
                <Icon name="image" />Preview
              </Button>
              <Button color="red" inverted onClick={this.closeModal}>
                <Icon name="remove" />Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    )
  }
}

export default UserPanel;