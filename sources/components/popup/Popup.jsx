import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './popup.scss';

const HANDLE_SHADOW_CLICK_TIMEOUT = 300;

class Popup extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.element.isRequired,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.visible && !this.props.visible) {
      // prevent close popup on link double click
      this.handleShadowClick = false;
      this.handleShadowClickTimer = setTimeout(() => {
        this.handleShadowClick = true;
      }, HANDLE_SHADOW_CLICK_TIMEOUT);
    } else if (!nextProps.visible && this.props.visible) {
      this.resetTimer();
    }
  }

  componentWillUnmount() {
    this.resetTimer();
  }

  onShadowClick = () => {
    if (this.handleShadowClick) {
      this.props.onClose();
    }
  };

  onCloseClick = () => {
    this.props.onClose();
  };

  resetTimer() {
    if (this.handleShadowClickTimer) {
      clearTimeout(this.handleShadowClickTimer);
    }
  }

  handleShadowClick = false;
  handleShadowClickTimer = null;

  render() {
    const { children, visible, title } = this.props;

    const className = cn('popup', visible && 'popup_visible');

    return (
      <div className={className}>
        <div
          className="popup__shadow"
          role="presentation"
          onClick={this.onShadowClick}
        />

        <div className="popup__wrapper">
          <header className="popup__header">
            <h3 className="popup__title">
              {title}
            </h3>

            <button
              type="button"
              className="popup__close-button"
              onClick={this.onCloseClick}
            >
              ×
            </button>
          </header>

          <div className="popup__content">
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;
