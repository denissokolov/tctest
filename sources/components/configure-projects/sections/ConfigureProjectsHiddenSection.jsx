import React from 'react';
import PropTypes from 'prop-types';
import { List } from 'immutable';

import { getSelectedIdsWithChildren } from '../../../utils/projectSelectUtils';
import ProjectsSelect, { types as projectsSelectTypes } from '../project-select/ProjectsSelect';
import ArrowButton, { directions as arrowButtonDirections } from '../../arrow-button/ArrowButton';
import FilterProjects from '../filter/FilterProjects';

class ConfigureProjectsHiddenSection extends React.Component {
  static propTypes = {
    hidden: PropTypes.instanceOf(List).isRequired,
    hiddenFilterValue: PropTypes.string.isRequired,
    formVisible: PropTypes.bool.isRequired,
    showProjects: PropTypes.func.isRequired,
    changeHiddenFilter: PropTypes.func.isRequired,
  };

  state = {
    anyHiddenSelected: false,
  };

  onShowClick = () => {
    const { showProjects, hidden } = this.props;
    const selectedIds = getSelectedIdsWithChildren(this.hiddenOptions, hidden, 'parentId');
    showProjects(selectedIds);
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

  hiddenOptions = [];

  render() {
    const { anyHiddenSelected } = this.state;
    const { hidden, hiddenFilterValue, formVisible } = this.props;

    return (
      <div className="configure-projects__section">
        <div className="configure-projects__control configure-projects__control_bottom configure-projects__control_center">
          <ArrowButton
            direction={arrowButtonDirections.left}
            onClick={this.onShowClick}
            disabled={!anyHiddenSelected}
          />
        </div>

        <div className="configure-projects__section-title">
          Hidden projects
        </div>

        <FilterProjects
          onChange={this.onHiddenFilterChange}
          value={hiddenFilterValue}
        />

        <div className="configure-projects__select configure-projects__select_with-filter">
          <ProjectsSelect
            items={hidden}
            onChange={this.onHiddenSelectChange}
            type={projectsSelectTypes.hidden}
            filterActive={Boolean(hiddenFilterValue)}
            formVisible={formVisible}
          />
        </div>
      </div>
    );
  }
}

export default ConfigureProjectsHiddenSection;