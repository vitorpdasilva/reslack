import React, { Component } from 'react';
import { Segment, Accordion, Header, Icon, Image } from 'semantic-ui-react';

export default class MetaPanel extends Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    activeIndex: 0,
    channel: this.props.currentChannel,
  }

  setActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  }

  render() {
    console.log(this.props);
    const { activeIndex, privateChannel, channel } = this.state;
    if (privateChannel) return null;
    return (
      <Segment loading={!channel}>
        <Header as="h3" attached="top">
          about # {channel && channel.name}
        </Header>
        <Accordion styled attached="true">
          <Accordion.Title 
            active={activeIndex === 0} 
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="info" />
            Channel Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            {channel && channel.details}
          </Accordion.Content>

          <Accordion.Title 
            active={activeIndex === 1} 
            index={1}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top Posters
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            posters
          </Accordion.Content>

          <Accordion.Title 
            active={activeIndex === 2} 
            index={2}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created By
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 2}>
            <Header as="h3">
              <Image circular src={channel && channel.createdBy.avatar} />
              {channel && channel.createdBy.name}
            </Header>
          </Accordion.Content>
        </Accordion>
      </Segment>
    )
  }
}
