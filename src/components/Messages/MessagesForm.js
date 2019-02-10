import React, { Component } from 'react';
import { Segment, Button, Input} from 'semantic-ui-react';

class MessagesForm extends Component {
  render() {
    return (
      <Segment className="message__form">
        <Input 
          fluid 
          name="message" 
          style={{ marginBottom: '.7em' }} 
          label={<Button icon={"add"} />}
          labelPosition="left"
          placeholder="write your message"
        />
        <Button.Group icon widths="2">
          <Button color="orange" content="add Reply" labelPosition="left" icon="edit" />
          <Button color="teal" content="upload media" labelPosition="right" icon="cloud upload" />
        </Button.Group>
      </Segment>
    )
  }
}

export default MessagesForm;
