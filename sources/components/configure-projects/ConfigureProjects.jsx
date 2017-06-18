import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { loadProjects } from '../../actions/ConfigureProjectsActions';

import VisibleProjects from './visible-projects/VisibleProjects';

export class ConfigureProjects extends React.Component {
  static propTypes = {
    configureProjects: PropTypes.instanceOf(Map).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(loadProjects());
  }

  render() {
    const { configureProjects } = this.props;
    const visibleProjects = configureProjects.get('visible');
    const error = configureProjects.get('error');

    return (
      <div>
        <div>Projects</div>

        {error && error.message}

        {configureProjects.get('loading') && <span>Loading...</span>}

        {!visibleProjects.isEmpty() && <VisibleProjects items={visibleProjects} />}
      </div>
    );
  }
}

export default connect(state => ({
  configureProjects: state.configureProjects,
}))(ConfigureProjects);
