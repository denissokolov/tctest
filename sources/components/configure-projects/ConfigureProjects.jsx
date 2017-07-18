import React from 'react';
import PropTypes from 'prop-types';

import ConnectedConfigureProjectsFooter from './footer/ConfigureProjectsFooter';
import ConfigureProjectsVisibleSection from './sections/ConfigureProjectsVisibleSection';
import ConfigureProjectsHiddenSection from './sections/ConfigureProjectsHiddenSection';

import './configure-projects.scss';

class ConfigureProjects extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  onCancelClick = () => {
    this.props.onCancel();
  };

  onSubmit = (event) => {
    event.preventDefault();
    this.props.onSubmit();
  };

  render() {
    return (
      <form className="configure-projects" onSubmit={this.onSubmit}>
        <div className="configure-projects__sections">
          <ConfigureProjectsVisibleSection />
          <ConfigureProjectsHiddenSection />
        </div>

        <ConnectedConfigureProjectsFooter
          onCancelClick={this.onCancelClick}
        />
      </form>
    );
  }
}

export default ConfigureProjects;
