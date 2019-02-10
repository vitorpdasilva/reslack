import React, { Component } from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

class MessagesHeader extends Component {
  render() {
    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            Channel
            <Icon name={"star outline"} color="black"></Icon>
          </span>
          <Header.Subheader>2 users</Header.Subheader>
        </Header>
        <Header floated="right">
          <Input size="mini" icon="search" name="searchTerm" placeholder="Search messages" />
        </Header>
      </Segment>
    );
  }
}

export default  MessagesHeader;
