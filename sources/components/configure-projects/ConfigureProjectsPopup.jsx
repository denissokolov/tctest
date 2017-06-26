import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import ConfigureProjects from '../configure-projects/ConfigureProjects';
import {
  refreshProjectsConfiguration, saveProjectsConfiguration, loadProjects,
} from '../../actions/ConfigureProjectsActions';

import Popup from '../popup/Popup';

class ConfigureProjectsPopup extends React.Component {
  static propTypes = {
    configureProjects: PropTypes.instanceOf(Map).isRequired,
    dispatch: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired,
  };

  componentDidMount() {
    this.props.dispatch(loadProjects());
  }

  onCancel = () => {
    this.props.onClose();
    this.props.dispatch(refreshProjectsConfiguration());
  };

  onSubmit = () => {
    this.props.onClose();
    this.props.dispatch(saveProjectsConfiguration());
  };

  render() {
    const { dispatch, visible, configureProjects } = this.props;

    return (
      <Popup
        title="Configure visible projects"
        onClose={this.onCancel}
        visible={visible}
      >
        <ConfigureProjects
          configureProjects={configureProjects}
          dispatch={dispatch}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
          formVisible={visible}
        />
      </Popup>
    );
  }
}

export default connect(state => ({
  configureProjects: state.configureProjects,
}))(ConfigureProjectsPopup);
