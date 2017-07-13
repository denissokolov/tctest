import React from 'react';
import PropTypes from 'prop-types';

import { getSelectedIds, getSelectedIdsWithChildren } from '../../../utils/projectSelectUtils';
import ProjectsSelect from '../project-select/ProjectsSelect';
import ArrowButton, { directions as arrowButtonDirections } from '../../arrow-button/ArrowButton';

class ConfigureProjectsVisibleSection extends React.Component {
  static propTypes = {
    visible: PropTypes.arrayOf(PropTypes.object).isRequired,
    formVisible: PropTypes.bool.isRequired,
    hideProjects: PropTypes.func.isRequired,
    moveProjectsUp: PropTypes.func.isRequired,
    moveProjectsDown: PropTypes.func.isRequired,
  };

  state = {
    anyVisibleSelected: false,
  };

  onHideClick = () => {
    this.setState({ anyVisibleSelected: false });

    const { hideProjects, visible } = this.props;
    const selectedIdsWithChildren = getSelectedIdsWithChildren(this.selectedIds, visible);
    hideProjects(selectedIdsWithChildren);
  };

  onMoveUpClick = () => {
    this.props.moveProjectsUp(this.selectedIds);
  };

  onMoveDownClick = () => {
    this.props.moveProjectsDown(this.selectedIds);
  };

  onVisibleSelectChange = (event) => {
    this.selectedIds = getSelectedIds(event.target.options);

    if (this.selectedIds.length && !this.state.anyVisibleSelected) {
      this.setState({ anyVisibleSelected: true });
    }
  };

  selectedIds = [];

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
