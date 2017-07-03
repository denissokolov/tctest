// TODO: try to divide into two components
import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import { getSelectedIds, getSelectedIdsWithChildren } from '../../utils/projectSelectUtils';
import ProjectsSelect, { types as projectsSelectTypes } from './project-select/ProjectsSelect';
import ConfigureProjectsSortControls from './ConfigureProjectsSortControls';
import ConfigureProjectsVisibleControls from './ConfigureProjectsVisibleControls';
import FilterProjects from './controls/FilterProjects';

class ConfigureProjectsMain extends React.Component {
  static propTypes = {
    visible: PropTypes.instanceOf(List).isRequired,
    hidden: PropTypes.instanceOf(List).isRequired,
    hiddenFilterValue: PropTypes.string.isRequired,
    formVisible: PropTypes.bool.isRequired,
    hideProjects: PropTypes.func.isRequired,
    showProjects: PropTypes.func.isRequired,
    moveProjectsUp: PropTypes.func.isRequired,
    moveProjectsDown: PropTypes.func.isRequired,
    changeHiddenFilter: PropTypes.func.isRequired,
  };

  state = {
    anyVisibleSelected: false,
    anyHiddenSelected: false,
  };

  onHideClick = () => {
    const { hideProjects, visible } = this.props;
    const selectedIds = getSelectedIdsWithChildren(this.visibleOptions, visible, 'visibleParentId');
    hideProjects(selectedIds);
  };

  onShowClick = () => {
    const { showProjects, hidden } = this.props;
    const selectedIds = getSelectedIdsWithChildren(this.hiddenOptions, hidden, 'parentId');
    showProjects(selectedIds);
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

  onHiddenSelectChange = (event) => {
    this.hiddenOptions = event.target.options;

    const anyHiddenSelected = Boolean(event.target.options);
    if (anyHiddenSelected !== this.state.anyHiddenSelected) {
      this.setState({ anyHiddenSelected });
    }
  };

  onHiddenFilterChange = (event) => {
    this.props.changeHiddenFilter(event.target.value);
  };

  visibleOptions = [];
  hiddenOptions = [];

  render() {
    const { anyHiddenSelected, anyVisibleSelected } = this.state;
    const { visible, hidden, hiddenFilterValue, formVisible } = this.props;

    return (
      <div className="configure-projects__main">
        <ConfigureProjectsSortControls
          onMoveDownClick={this.onMoveDownClick}
          onMoveUpClick={this.onMoveUpClick}
          isDisabled={!anyVisibleSelected}
        />

        <div className="configure-projects__items-wrapper">
          <div className="configure-projects__items-title">
            Visible projects
          </div>

          <div className="configure-projects__items">
            <ProjectsSelect
              items={visible}
              onChange={this.onVisibleSelectChange}
              type={projectsSelectTypes.visible}
              formVisible={formVisible}
            />
          </div>
        </div>

        <ConfigureProjectsVisibleControls
          hideIsDisabled={!anyVisibleSelected}
          showIsDisabled={!anyHiddenSelected}
          onShowClick={this.onShowClick}
          onHideClick={this.onHideClick}
        />

        <div className="configure-projects__items-wrapper">
          <div className="configure-projects__items-title">
            Hidden projects
          </div>

          <FilterProjects
            onChange={this.onHiddenFilterChange}
            value={hiddenFilterValue}
          />

          <div className="configure-projects__items configure-projects__items_with-filter">
            <ProjectsSelect
              items={hidden}
              onChange={this.onHiddenSelectChange}
              type={projectsSelectTypes.hidden}
              filterActive={Boolean(hiddenFilterValue)}
              formVisible={formVisible}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ConfigureProjectsMain;
