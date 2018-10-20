import * as React from 'react';
import noop = require('lodash/noop')
import {create, VIDEO_EVENTS, ENGINE_STATES} from 'playable';

import {playerComponents, playerVerifiers} from './players';
import {PlayerNamesType, ICommonProps, IConfig} from './types';

import styles from './Video.st.css';

const getPlayerName = (url: string | Array<string>): PlayerNamesType => {
  for (let key in playerVerifiers) {
    const name = key as PlayerNamesType;

    if (playerVerifiers[name](url)) {
      return name;
    }
  }

  return null;
};

export interface IVideoProps extends ICommonProps {
  id?: string;
  config?: IConfig;
  playerRef?: Function;
  fillAllSpace?: boolean;
  width?: number | string;
  height?: number | string;
}

export interface IVideoState {
  playerName: PlayerNamesType;
}

export class Video extends React.Component<IVideoProps, IVideoState> {
  static displayName = 'Video';
  static getPlayerName = getPlayerName;
  static defaultProps = {
    controls: true,
    showTitle: true,
    onReady: noop,
    onDuration: noop,
    onPlay: noop,
    onPause: noop,
    onEnded: noop,
    onProgress: noop,
    onError: noop,
    onFirstPlay: noop,
    onFirstEnded: noop,
    config: {}
  };

  state: IVideoState = {
    playerName: null,
  };

  constructor(props: IVideoProps) {
    super(props);

    this.state.playerName = Video.getPlayerName(this.props.src)
  }

  componentWillReceiveProps(nextProps: IVideoProps) {
    if (this.props.src !== nextProps.src) {
      this.setState({
        playerName: Video.getPlayerName(nextProps.src)
      })
    }
  }

  render() {
    const {playerName} = this.state;

    if (!playerName) {
      return null;
    }

    const Player = playerComponents[playerName];
    const playerProps = {...this.props, ...this.props.config[playerName]};
    const {id, fillAllSpace, playerRef} = this.props;
    let {width, height} = this.props;

    if (fillAllSpace) {
      width = '100%';
      height = '100%';
    }

    return (
      <div
        id={id}
        style={{width, height}}
        {...styles('root', {}, this.props)}
      >
        <Player
          {...playerProps}
          key={playerName}
          ref={playerRef}
        />
      </div>
    );
  }
}
