/* eslint-disable max-len */
import PropTypes from "prop-types";
import React from "react";

const AppLoadingScreenStyles = `
 .loader-wrapper {
    height: 100vh;
    width: 100vw;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    background: #bee2ea;
    color: #222;
    font-family: GT America, Roboto, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .loader-inner {
    margin: auto;
    text-align: center;
  }
  
  .loader-text {
    display: block;
    margin-top: 12px;
    font-weight: normal;
  }

  .pulse {
    display: inline-block;
    width: 35px;
    height: 35px;
    background-color: transparent;
    border: 3px solid white;
    border-radius: 100%;
    animation: pulse 1.2s infinite cubic-bezier(0.455, 0.03, 0.515, 0.955); 
  }

  @keyframes pulse {
    0% {
      transform: scale(0); 
    } 100% {
      transform: scale(1);
      opacity: 0; 
    }
  }
`;

export default class AppLoadingScreen extends React.PureComponent {
  static propTypes = {
    text: PropTypes.string,
  };

  static defaultProps = {
    text: "Loading Content Studio",
  };

  render() {
    return (
      <div className="loader-wrapper">
        <div className="loader-inner">
          <style dangerouslySetInnerHTML={{ __html: AppLoadingScreenStyles }}/>
          <div className="pulse" />
          <div className="loader-text">{this.props.text}</div>
        </div>
      </div>
    );
  }
}
