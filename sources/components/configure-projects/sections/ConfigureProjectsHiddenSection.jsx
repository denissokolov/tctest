import React from 'react';

import ConnectedFilterProjects from '../filter/FilterProjects';
import ConnectedShowButton from '../buttons/ShowButton';
import ConnectedHiddenProjectsSelect from '../selects/HiddenProjectsSelect';

function ConfigureProjectsHiddenSection() {
  return (
    <div className="configure-projects__section">
      <div className="configure-projects__control configure-projects__control_bottom configure-projects__control_center">
        <ConnectedShowButton />
      </div>

      <div className="configure-projects__section-title">
        Hidden projects
      </div>

      <ConnectedFilterProjects />

      <div className="configure-projects__select configure-projects__select_with-filter">
        <ConnectedHiddenProjectsSelect />
      </div>
    </div>
  );
}

export default ConfigureProjectsHiddenSection;
