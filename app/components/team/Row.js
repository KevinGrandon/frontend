import React from 'react';
import Relay from 'react-relay';

import Panel from '../shared/Panel'
import UserAvatar from '../shared/UserAvatar'
import Emojify from '../shared/Emojify';

class Row extends React.Component {
  static propTypes = {
    team: React.PropTypes.shape({
      id: React.PropTypes.string.isRequired,
      name: React.PropTypes.string.isRequired,
      slug: React.PropTypes.string.isRequired,
      organization: React.PropTypes.shape({
        slug: React.PropTypes.string.isRequired
      }).isRequired,
      members: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired,
        edges: React.PropTypes.arrayOf(
          React.PropTypes.shape({
            node: React.PropTypes.object.isRequired
          }).isRequired
        ).isRequired
      }).isRequired,
      pipelines: React.PropTypes.shape({
        count: React.PropTypes.number.isRequired
      }).isRequired
    }).isRequired
  };

  render() {
    return (
      <Panel.RowLink key={this.props.team.id} to={`/organizations/${this.props.team.organization.slug}/teams/${this.props.team.slug}`}>
        <span className="semi-bold block"><Emojify text={this.props.team.name} /></span>
        <span className="regular dark-gray block">{this.props.team.members.count} members · {this.props.team.pipelines.count} projects</span>
        <div style={{marginTop: 3}}>
          {
            this.props.team.members.edges.map((edge, index) => {
              return (
                <UserAvatar
                  key={edge.node.id}
                  user={edge.node.user}
                  className="border border-white"
                  style={{width: 20, height: 20, marginRight: -4, zIndex: this.props.team.members.edges.length - index, position: "relative"}} />
                )
            })
          }
        </div>
      </Panel.RowLink>
    );
  }
}

export default Relay.createContainer(Row, {
  fragments: {
    team: () => Relay.QL`
      fragment on Team {
        id
        name
        description
        slug
        organization {
          slug
        }
        members(first: 3) {
          count
          edges {
            node {
              id
              user {
                name
                avatar {
                  url
                }
              }
            }
          }
        },
        pipelines {
          count
        }
      }
    `
  }
});