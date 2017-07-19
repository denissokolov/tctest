import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { hideProjects } from '../../../actions/ConfigureProjectsActions';

import ArrowButton, { directions as arrowButtonDirections } from '../../arrow-button/ArrowButton';

export class HideButton extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired,
  };

  onClick = () => {
    this.props.dispatch(hideProjects());
  };

  render() {
    const { disabled } = this.props;

    return (
      <ArrowButton
        direction={arrowButtonDirections.right}
        title="Hide selected (ctrl+H)"
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

export default connect(mapStateToProps)(HideButton);
