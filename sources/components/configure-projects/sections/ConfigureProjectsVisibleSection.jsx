import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import { getSelectedIds, getSelectedIdsWithChildren } from '../../../utils/projectSelectUtils';
import ProjectsSelect, { types as projectsSelectTypes } from '../project-select/ProjectsSelect';
import ArrowButton, { directions as arrowButtonDirections } from '../../arrow-button/ArrowButton';

class ConfigureProjectsVisibleSection extends React.Component {
  static propTypes = {
    visible: PropTypes.instanceOf(List).isRequired,
    formVisible: PropTypes.bool.isRequired,
    hideProjects: PropTypes.func.isRequired,
    moveProjectsUp: PropTypes.func.isRequired,
    moveProjectsDown: PropTypes.func.isRequired,
  };

  state = {
    anyVisibleSelected: false,
  };

  onHideClick = () => {
    const { hideProjects, visible } = this.props;
    this.setState({ anyVisibleSelected: false });
    const selectedIds = getSelectedIdsWithChildren(this.visibleOptions, visible, 'visibleParentId');
    hideProjects(selectedIds);
  };

  onMoveUpClick = () => {
    const selectedIds = getSelectedIds(this.visibleOptions);
    this.props.moveProjectsUp(selectedIds);
  };

  onMoveDownClick = () => {
    const selectedIds = getSelectedIds(this.visibleOptions);
    this.props.moveProjectsDown(selectedIds);
  };

  onVisibleSelectChange = (event) => {
    this.visibleOptions = event.target.options;

    const anyVisibleSelected = Boolean(event.target.options);
    if (anyVisibleSelected !== this.state.anyVisibleSelected) {
      this.setState({ anyVisibleSelected });
    }
  };

  visibleOptions = [];

  render() {
    const { anyVisibleSelected } = this.state;
    const { visible, formVisible } = this.props;

    return (
      <div className="configure-projects__section">
        <div className="configure-projects__control configure-projects__control_top configure-projects__control_left">
          <ArrowButton
            direction={arrowButtonDirections.up}
            onClick={this.onMoveUpClick}
            disabled={!anyVisibleSelected}
          />
        </div>

        <div className="configure-projects__control configure-projects__control_bottom configure-projects__control_left">
          <ArrowButton
            direction={arrowButtonDirections.down}
            onClick={this.onMoveDownClick}
            disabled={!anyVisibleSelected}
          />
        </div>

        <div className="configure-projects__section-title">
          Visible projects
        </div>

        <div className="configure-projects__select">
          <ProjectsSelect
            items={visible}
            onChange={this.onVisibleSelectChange}
            type={projectsSelectTypes.visible}
            formVisible={formVisible}
          />
        </div>

        <div className="configure-projects__control configure-projects__control_top configure-projects__control_center">
          <ArrowButton
            direction={arrowButtonDirections.right}
            onClick={this.onHideClick}
            disabled={!anyVisibleSelected}
          />
        </div>
      </div>
    );
  }
}

export default ConfigureProjectsVisibleSection;
