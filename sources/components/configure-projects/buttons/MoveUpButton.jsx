import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { moveProjectsUp } from '../../../actions/ConfigureProjectsActions';

import ArrowButton, { directions as arrowButtonDirections } from '../../arrow-button/ArrowButton';

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
        title="Move up selected (ctrl+U)"
        onClick={this.onClick}
        disabled={disabled}
        tabIndex={-1}
      />
    );
  }
}

const mapStateToProps = state => ({
  disabled: state.configureProjects.get('visibleSelectedIds').size === 0,
});

export default connect(mapStateToProps)(MoveUpButton);
