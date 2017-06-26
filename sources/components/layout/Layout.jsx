import React from 'react';
import ConnectedConfigureProjectsPopup from '../configure-projects/ConfigureProjectsPopup';

import './layout.scss';

class Layout extends React.Component {
  state = {
    showConfigureProjects: false,
  };

  onConfigureProjectsLinkClick = (event) => {
    event.preventDefault();
    this.setState({ showConfigureProjects: true });
  };

  onConfigureProjectsClose = () => {
    this.setState({ showConfigureProjects: false });
  };

  render() {
    return (
      <div className="layout">
        <a
          className="layout__configure-projects-link"
          href=""
          role="button"
          onClick={this.onConfigureProjectsLinkClick}
        >
          Configure Visible Projects
        </a>

        <ConnectedConfigureProjectsPopup
          onClose={this.onConfigureProjectsClose}
          visible={this.state.showConfigureProjects}
        />
      </div>
    );
  }
}

export default Layout;
