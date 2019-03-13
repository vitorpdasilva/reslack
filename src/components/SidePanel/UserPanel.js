import React, { Component } from 'react';
import firebase from '../../firebase';
import AvatarEditor from 'react-avatar-editor';
import { Grid, Header, Icon, Dropdown, Image, Modal, Button, Input } from 'semantic-ui-react';

class UserPanel extends Component {

  state = {
    user: this.props.currentUser,
    modal: false,
    previewImage: '',
    croppedImage: '',
    blob: '',

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

  handleChange = event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    if(file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', () => {
        this.setState({ previewImage: reader.result })
      })
    }
  }

  handleCropImage = () => {
    if(this.AvatarEditor) {
      this.AvatarEditor.getImageScaledToCanvas().toBlob(blob => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({ croppedImage: imageUrl, blob })
      })
    }
  }

  render() {
    const { user, modal, previewImage, croppedImage } = this.state;
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
              <Input onChange={this.handleChange} fluid type="file" label="new avatar" name="preview image" />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className="ui center aligned grid">
                    {previewImage && (
                      <AvatarEditor 
                        image={previewImage}
                        width={120}
                        height={120}
                        border={50}
                        scale={1.2}
                        ref={node => (this.AvatarEditor = node)}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {croppedImage && (
                      <Image style={{ margin: '3.5em auto' }} width={100} height={100} src={croppedImage} />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {croppedImage && (
                <Button color="green" inverted>
                  <Icon name="save" />Change Avatar
                </Button>
              )}
              <Button color="green" inverted onClick={this.handleCropImage}>
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