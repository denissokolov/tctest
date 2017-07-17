import React from 'react';

import ConnectedMoveUpButton from '../buttons/MoveUpButton';
import ConnectedMoveDownButton from '../buttons/MoveDownButton';
import ConnectedHideButton from '../buttons/HideButton';
import ConnectedVisibleProjectsSelect from '../selects/VisibleProjectsSelect';

function ConfigureProjectsVisibleSection() {
  return (
    <div className="configure-projects__section">
      <div className="configure-projects__control configure-projects__control_top configure-projects__control_left">
        <ConnectedMoveUpButton />
      </div>

      <div className="configure-projects__control configure-projects__control_bottom configure-projects__control_left">
        <ConnectedMoveDownButton />
      </div>

      <div className="configure-projects__section-title">
        Visible projects
      </div>

      <div className="configure-projects__select">
        <ConnectedVisibleProjectsSelect />
      </div>

      <div className="configure-projects__control configure-projects__control_top configure-projects__control_center">
        <ConnectedHideButton />
      </div>
    </div>
  );
}

export default ConfigureProjectsVisibleSection;
