import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { loadProjects } from '../../actions/ConfigureProjectsActions';

import VisibleProjects from './visible-projects/VisibleProjects';

import './configure-projects.scss';

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
      <div className="configure-projects">
        {error && error.message}

        {configureProjects.get('loading') && <span>Loading...</span>}

        {!visibleProjects.isEmpty() && (
          <div className="configure-projects__items">
            <VisibleProjects items={visibleProjects} />
          </div>
        )}
      </div>
    );
  }
}

export default connect(state => ({
  configureProjects: state.configureProjects,
}))(ConfigureProjects);
