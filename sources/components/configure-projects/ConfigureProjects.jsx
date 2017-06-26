import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import * as ConfigureProjectsActions from '../../actions/ConfigureProjectsActions';
import ConfigureProjectsButtons from './configure-projects-buttons/ConfigureProjectsButtons';
import ConfigureProjectsMain from './ConfigureProjectsMain';

import './configure-projects.scss';
import '../centered-block/centered-block.scss';

export class ConfigureProjects extends React.Component {
  static propTypes = {
    configureProjects: PropTypes.instanceOf(Map).isRequired,
    dispatch: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(ConfigureProjectsActions.loadProjects());
  }

  onCancelClick = () => {
    this.props.close();
    this.props.dispatch(ConfigureProjectsActions.refreshProjectsConfiguration());
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.props.close();
    this.props.dispatch(ConfigureProjectsActions.saveProjectsConfiguration());
  };

  render() {
    const { configureProjects, dispatch } = this.props;
    const error = configureProjects.get('error');

    return (
      <form className="configure-projects" onSubmit={this.onSubmit}>
        {error && error.message}

        {configureProjects.get('loading') && <span className="configure-projects__loading">Loading...</span>}

        <ConfigureProjectsMain
          visible={configureProjects.get('visible')}
          hidden={configureProjects.get('hidden')}
          hiddenFilterIsActive={configureProjects.get('hiddenFilterIsActive')}
          {...bindActionCreators(ConfigureProjectsActions, dispatch)}
        />

        <ConfigureProjectsButtons
          onCancelClick={this.onCancelClick}
          customSort={configureProjects.get('customSort')}
        />
      </form>
    );
  }
}

export default connect(state => ({
  configureProjects: state.configureProjects,
}))(ConfigureProjects);
