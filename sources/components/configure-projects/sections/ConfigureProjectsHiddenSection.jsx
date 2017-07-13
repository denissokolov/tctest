import React from 'react';
import PropTypes from 'prop-types';

import { getSelectedIdsWithChildren, getSelectedIds } from '../../../utils/projectSelectUtils';
import ProjectsSelect from '../project-select/ProjectsSelect';
import ArrowButton, { directions as arrowButtonDirections } from '../../arrow-button/ArrowButton';
import FilterProjects from '../filter/FilterProjects';

class ConfigureProjectsHiddenSection extends React.Component {
  static propTypes = {
    hidden: PropTypes.arrayOf(PropTypes.object).isRequired,
    hiddenFilterValue: PropTypes.string.isRequired,
    formVisible: PropTypes.bool.isRequired,
    showProjects: PropTypes.func.isRequired,
    changeHiddenFilter: PropTypes.func.isRequired,
  };

  state = {
    anyHiddenSelected: false,
  };

  onShowClick = () => {
    this.setState({ anyHiddenSelected: false });

    const { showProjects, hidden } = this.props;
    const selectedIds = getSelectedIdsWithChildren(this.selectedIds, hidden);
    showProjects(selectedIds);
  };

  onHiddenSelectChange = (event) => {
    this.selectedIds = getSelectedIds(event.target.options);

    if (this.selectedIds.length && !this.state.anyHiddenSelected) {
      this.setState({ anyHiddenSelected: true });
    }
  };

  onHiddenFilterChange = (event) => {
    this.props.changeHiddenFilter(event.target.value);
  };

  selectedIds = [];

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
            formVisible={formVisible}
            filterActive={Boolean(hiddenFilterValue)}
          />
        </div>
      </div>
    );
  }
}

export default ConfigureProjectsHiddenSection;
