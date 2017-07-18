import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { changeHiddenFilter } from '../../../actions/ConfigureProjectsActions';

export class FilterProjects extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  onChange = (event) => {
    this.props.dispatch(changeHiddenFilter(event.target.value));
  };

  render() {
    const { value } = this.props;

    return (
      <input
        type="text"
        onChange={this.onChange}
        className="configure-projects__filter"
        placeholder="filter projects"
        value={value}
      />
    );
  }
}

const mapStateToProps = state => ({
  value: state.configureProjects.get('hiddenFilterValue'),
});

export default connect(mapStateToProps)(FilterProjects);
