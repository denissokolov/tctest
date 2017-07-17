import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { moveProjectsUp } from '../../../../actions/ConfigureProjectsActions';

import ArrowButton, { directions as arrowButtonDirections } from '../../../arrow-button/ArrowButton';

export class MoveUpButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
  };

  onClick = () => {
    this.props.dispatch(moveProjectsUp());
  };

  render() {
    const { disabled } = this.props;

    return (
      <ArrowButton
        direction={arrowButtonDirections.up}
        onClick={this.onClick}
        disabled={disabled}
      />
    );
  }
}

const mapStateToProps = state => ({
  disabled: state.configureProjects.get('visibleSelectedIds').size === 0,
});

export default connect(mapStateToProps)(MoveUpButton);
