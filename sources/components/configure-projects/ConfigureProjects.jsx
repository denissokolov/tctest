import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';
import { loadProjects, hideProjects } from '../../actions/ConfigureProjectsActions';

import ProjectsSelect from './project-select/ProjectsSelect';

import './configure-projects.scss';

export class ConfigureProjects extends React.Component {
  static propTypes = {
    configureProjects: PropTypes.instanceOf(Map).isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(loadProjects());
  }

  onVisibleSelectChange = (event) => {
    this.visibleSelected = this.getSelectValues(event.target);
  };

  onHiddenSelectChange = (event) => {
    this.hiddenSelected = this.getSelectValues(event.target);
  };

  onHideClick = () => {
    this.props.dispatch(hideProjects(this.visibleSelected));
  };

  getSelectValues = (select) => {
    const options = select.options;
    const values = [];

    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        values.push(options[i].value);
      }
    }

    return values;
  };

  visibleSelected = [];
  hiddenSelected = [];

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
            <ProjectsSelect
              items={visibleProjects}
              onChange={this.onVisibleSelectChange}
            />
          </div>
        </div>

        <div className="configure-projects__buttons configure-projects__buttons_move">
          <button type="button" onClick={this.onHideClick}>
            {'->'}
          </button>
        </div>

        <div className="configure-projects__items-wrapper">
          <div className="configure-projects__items-title">
            Hidden projects
          </div>

          <div className="configure-projects__items">
            <ProjectsSelect
              items={hiddenProjects}
              onChange={this.onHiddenSelectChange}
              disableVisibleItems
              showOriginalData
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  configureProjects: state.configureProjects,
}))(ConfigureProjects);
