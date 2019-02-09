import React, { Component } from 'react'
import { Grid, Header, Icon, Dropdown } from 'semantic-ui-react';

export default class UserPanel extends Component {
  dropDownOptions = () => [
    { key: 'user', text: <span>Signed in as <strong>user</strong></span>, disabled: true },
    { key: 'avatar', text: <span>Change Avatar</span> },
    { key: 'signout', text: <span>Sign out</span> }
  ]
  render() {
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
              <span>user</span>
            } options={this.dropDownOptions()}

            />
          </Header>
        </Grid.Column>
      </Grid>
    )
  }
}
