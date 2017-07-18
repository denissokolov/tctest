import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ConfigureProjects from '../configure-projects/ConfigureProjects';
import {
  refreshProjectsConfiguration, saveProjectsConfiguration, loadProjects,
} from '../../actions/ConfigureProjectsActions';

import Popup from '../popup/Popup';
import '../popup/popup-message.scss';

export class ConfigureProjectsPopup extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    error: PropTypes.string,
    loading: PropTypes.bool,
    visible: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    error: undefined,
    loading: false,
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
    const { visible, error, loading } = this.props;
    let content;

    if (!visible) {
      content = (<div />);
    } else if (error) {
      content = <div className="popup-message popup-message_error">{error}</div>;
    } else if (loading) {
      content = (<div className="popup-message popup-message_loading">Loading</div>);
    } else {
      content = (
        <ConfigureProjects
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
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

const mapStateToProps = state => ({
  error: state.configureProjects.get('error'),
  loading: state.configureProjects.get('loading'),
});

export default connect(mapStateToProps)(ConfigureProjectsPopup);
