import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { showProjects } from '../../../../actions/ConfigureProjectsActions';

import ArrowButton, { directions as arrowButtonDirections } from '../../../arrow-button/ArrowButton';

export class ShowButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
  };

  onClick = () => {
    this.props.dispatch(showProjects());
  };

  render() {
    const { disabled } = this.props;

    return (
      <ArrowButton
        direction={arrowButtonDirections.left}
        onClick={this.onClick}
        disabled={disabled}
      />
    );
  }
}

const mapStateToProps = state => ({
  disabled: state.configureProjects.get('hiddenSelectedIds').size === 0,
});

export default connect(mapStateToProps)(ShowButton);
