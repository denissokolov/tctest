import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { loadProjects } from '../../actions/ConfigureProjectsActions';

import ProjectsSelect from './visible-projects/ProjectsSelect';

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
    const hiddenProjects = configureProjects.get('hidden');
    const error = configureProjects.get('error');

    return (
      <div className="configure-projects">
        {error && error.message}

        {configureProjects.get('loading') && <span>Loading...</span>}

        <div className="configure-projects__buttons" />

        <div className="configure-projects__items-wrapper">
          <div className="configure-projects__items-title">
            Visible projects
          </div>

          <div className="configure-projects__items">
            {!visibleProjects.isEmpty() && (
              <ProjectsSelect items={visibleProjects} />
            )}
          </div>
        </div>

        <div className="configure-projects__buttons configure-projects__buttons_move" />

        <div className="configure-projects__items-wrapper">
          <div className="configure-projects__items-title">
            Hidden projects
          </div>

          <div className="configure-projects__items">
            {!hiddenProjects.isEmpty() && (
              <ProjectsSelect items={hiddenProjects} />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  configureProjects: state.configureProjects,
}))(ConfigureProjects);
