import React from 'react';
import PropTypes from 'prop-types';

import { isIE } from '../../../utils/browserDetectUtils';
import ProjectsSelectOption from './ProjectsSelectOption';
import './projects-select.scss';

class ProjectsSelect extends React.PureComponent {
  componentWillMount() {
    this.browserIsIE = isIE();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.formVisible && !nextProps.formVisible) {
      if (this.selectEl && this.selectEl.scrollTo) {
        this.selectEl.scrollTo(0, 0);
      }
    }
  }

  render() {
    const { items, onChange } = this.props;

    return (
      <select
        className="projects-select"
        onChange={onChange}
        multiple
        ref={(el) => { this.selectEl = el; }}
      >
        {items.map(item => (
          <ProjectsSelectOption
            key={item.id}
            id={item.id}
            name={item.name}
            depth={item.depth}
            parentCustomSort={item.parentCustomSort}
            disabled={item.noInteractive}
            filterMatch={item.filterMatch}
            browserIsIE={this.browserIsIE}
          />
        ))}
      </select>
    );
  }
}

ProjectsSelect.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
  formVisible: PropTypes.bool.isRequired,
};

export default ProjectsSelect;
