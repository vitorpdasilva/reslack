import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';

class DirectMessages extends Component {
  
  state = {
    users: [],
  }

  render() {
    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" /> Direct Message &nbsp;
          </span>
          ({users.length})
        </Menu.Item>
      </Menu.Menu>
    )
  }
}


export default DirectMessages;
