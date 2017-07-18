import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { moveProjectsDown } from '../../../actions/ConfigureProjectsActions';

import ArrowButton, { directions as arrowButtonDirections } from '../../arrow-button/ArrowButton';

export class MoveDownButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
  };

  onClick = () => {
    this.props.dispatch(moveProjectsDown());
  };

  render() {
    const { disabled } = this.props;

    return (
      <ArrowButton
        direction={arrowButtonDirections.down}
        onClick={this.onClick}
        disabled={disabled}
      />
    );
  }
}

const mapStateToProps = state => ({
  disabled: state.configureProjects.get('visibleSelectedIds').size === 0,
});

export default connect(mapStateToProps)(MoveDownButton);
