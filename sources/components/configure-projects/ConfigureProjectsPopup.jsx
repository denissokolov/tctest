import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Map } from 'immutable';

import ConfigureProjects from '../configure-projects/ConfigureProjects';
import {
  refreshProjectsConfiguration, saveProjectsConfiguration, loadProjects,
} from '../../actions/ConfigureProjectsActions';

import Popup from '../popup/Popup';
import '../popup/popup-message.scss';

export class ConfigureProjectsPopup extends React.Component {
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
    const error = configureProjects.get('error');

    let content;
    if (error) {
      content = <div className="popup-message popup-message_error">{error}</div>;
    } else if (configureProjects.get('loading')) {
      content = (<div className="popup-message popup-message_loading">Loading</div>);
    } else {
      content = (
        <ConfigureProjects
          configureProjects={configureProjects}
          dispatch={dispatch}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
          formVisible={visible}
        />
      );
    }

    return (
      <Popup
        title="Configure visible projects"
        onClose={this.onCancel}
        visible={visible}
      >
        {content}
      </Popup>
    );
  }
}

export default connect(state => ({
  configureProjects: state.configureProjects,
}))(ConfigureProjectsPopup);
