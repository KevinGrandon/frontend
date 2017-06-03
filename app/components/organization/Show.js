import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay/classic';
import DocumentTitle from 'react-document-title';
import styled from 'styled-components';
import { stringify } from 'query-string';

import Button from '../shared/Button';
import Icon from '../shared/Icon';
import PageWithContainer from '../shared/PageWithContainer';
import SearchField from '../shared/SearchField';

import Pipelines from './Pipelines';
import Teams from './Teams';

const FilterField = styled(SearchField)`
  flex-basis: 100%;
  order: 3;
  color: gray;

  & > input {
    color: inherit;
    font-size: inherit;
    font-weight: inherit;
  }

  @media (min-width: 480px) {
    font-size: 16px;
    flex-basis: 200px;
    margin-left: .5em;
    margin-right: 1em;
    margin-top: -.25em;
    order: initial;
  }
`;
// NOTE: the large-screen margin-left is ~half right
// to adjust for the position of SearchField's icon

FilterField.defaultProps = {
  className: 'light flex-auto'
};

class OrganizationShow extends React.Component {
  static propTypes = {
    organization: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string.isRequired
    }).isRequired,
    relay: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  };

  static contextTypes = {
    router: PropTypes.object.isRequired
  };

  componentDidMount() {
    this.props.relay.setVariables({ isMounted: true });
  }

  render() {
    return (
      <DocumentTitle title={`${this.props.organization.name}`}>
        <div>
          <PageWithContainer>
            <div className="flex flex-wrap items-start mb2">
              <h1 className="h1 p0 m0 regular line-height-1 inline-block">Pipelines</h1>
              {this.renderTeams()}
              {this.renderFilter()}

              <Button
                theme="default"
                outline={true}
                className="p0 ml-auto flex circle items-center justify-center"
                style={{
                  width: 34,
                  height: 34
                }}
                href={`/organizations/${this.props.organization.slug}/pipelines/new`}
                title="New Pipeline"
              >
                <Icon icon="plus" title="New Pipeline" />
              </Button>
            </div>

            <Pipelines
              organization={this.props.organization}
              team={this.props.location.query.team || null}
              filter={this.props.location.query.filter || null}
            />
          </PageWithContainer>
        </div>
      </DocumentTitle>
    );
  }

  renderTeams() {
    // Only render the teams dropdown once the `isMounted` Relay variable has
    // been executed
    if (this.props.relay.variables.isMounted) {
      return (
        <Teams selected={this.props.location.query.team} organization={this.props.organization} onTeamChange={this.handleTeamChange} />
      );
    }
  }

  handleTeamChange = (team) => {
    this.updateRoute({ team });
  };

  renderFilter() {
    return (
      <FilterField
        borderless={true}
        onChange={this.handleFilterChange}
        defaultValue={this.props.location.query.filter}
        searching={false}
        placeholder="Filter"
        autofocus={true}
      />
    );
  }

  handleFilterChange = (filter) => {
    this.updateRoute({ filter });
  };

  updateRoute = (variables) => {
    const queryObject = Object.assign({}, this.props.location.query, variables);

    // Prevent ugly URL's that look like "/acme-inc?team="
    Object.keys(queryObject).forEach((key) => {
      if (!queryObject[key]) {
        delete queryObject[key];
      }
    });

    const query = stringify(queryObject);

    if (query) {
      this.context.router.push(`/${this.props.organization.slug}?${query}`);
    } else {
      this.context.router.push(`/${this.props.organization.slug}`);
    }
  };
}

export default Relay.createContainer(OrganizationShow, {
  initialVariables: {
    isMounted: false
  },

  fragments: {
    organization: (variables) => Relay.QL`
      fragment on Organization {
        ${Teams.getFragment('organization').if(variables.isMounted)}
        ${Pipelines.getFragment('organization')}
        id
        slug
        name
      }
    `
  }
});
