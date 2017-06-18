import React from 'react';
import ConnectedConfigureProjects from '../configure-projects/ConfigureProjects';
import Popup from '../popup/Popup';

import './layout.scss';

class Layout extends React.Component {
  state = {
    showConfigureProjects: false,
  };

  onConfigureProjectsLinkClick = (event) => {
    event.preventDefault();
    this.setState({ showConfigureProjects: true });
  };

  onConfigureProjectsPopupClose = () => {
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

        <Popup
          title="Configure visible projects"
          visible={this.state.showConfigureProjects}
          onClose={this.onConfigureProjectsPopupClose}
        >
          <ConnectedConfigureProjects />
        </Popup>
      </div>
    );
  }
}

export default Layout;
