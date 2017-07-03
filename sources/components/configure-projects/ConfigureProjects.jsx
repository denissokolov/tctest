import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Map } from 'immutable';
import * as ConfigureProjectsActions from '../../actions/ConfigureProjectsActions';

import ConfigureProjectsFooter from './footer/ConfigureProjectsFooter';
import ConfigureProjectsVisibleSection from './sections/ConfigureProjectsVisibleSection';
import ConfigureProjectsHiddenSection from './sections/ConfigureProjectsHiddenSection';

import './configure-projects.scss';
import '../centered-block/centered-block.scss';

class ConfigureProjects extends React.Component {
  static propTypes = {
    configureProjects: PropTypes.instanceOf(Map).isRequired,
    dispatch: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    formVisible: PropTypes.bool.isRequired,
  };

  onCancelClick = () => {
    this.props.onCancel();
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit();
  };

  render() {
    const { configureProjects, formVisible, dispatch } = this.props;
    const boundActionCreators = bindActionCreators(ConfigureProjectsActions, dispatch);

    return (
      <form className="configure-projects" onSubmit={this.onSubmit}>
        <div className="configure-projects__sections">
          <ConfigureProjectsVisibleSection
            visible={configureProjects.get('visible')}
            formVisible={formVisible}
            {...boundActionCreators}
          />

          <ConfigureProjectsHiddenSection
            hidden={configureProjects.get('hidden')}
            hiddenFilterValue={configureProjects.get('hiddenFilterValue')}
            formVisible={formVisible}
            {...boundActionCreators}
          />
        </div>

        <ConfigureProjectsFooter
          onCancelClick={this.onCancelClick}
          customSort={configureProjects.get('customSort')}
        />
      </form>
    );
  }
}

export default ConfigureProjects;
