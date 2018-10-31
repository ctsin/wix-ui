import * as React from 'react';
import {EventEmitter} from 'eventemitter3';
import isString = require('lodash/isString');
import isArray = require('lodash/isArray');
import noop = require('lodash/noop');
import {create, VIDEO_EVENTS, ENGINE_STATES} from 'playable';

import {EVENTS} from '../constants';
import playerHOC from './playerHOC';
import {
  ICommonProps,
  IEventEmitter,
  IPropsToPlayer,
  IMethodsToPlayer,
  VerifierType,
  IPlayablePlayerAPI,
  IPlayableConfig,
} from '../types';
import styles from '../Video.st.css';

const MATCH_URL = /\.(mp4|og[gv]|webm|mov|m4v)($|\?)/i;

export const verifier: VerifierType = url => {
  if (isString(url)) {
    return MATCH_URL.test(url);
  } else if (isArray(url)) {
    for (let item of url) {
      if (MATCH_URL.test(item)) {
        return true;
      }
    }
  }

  return false;
};

const mapPropsToPlayer: IPropsToPlayer = {
  src: instance => instance._reload(),
  playing: (instance, player, nextPlaying) => {
    if (nextPlaying) {
      player.play();
    } else {
      player.pause();
    }
  },
  muted: (instance, player, nextMuted) => {
    if (nextMuted) {
      player.mute();
    } else {
      player.unmute();
    }
  },
  volume: 'setVolume',
  title: 'setTitle',
  loop: 'setLoop',
  logoUrl: 'setLogo',
  alwaysShowLogo: 'setAlwaysShowLogo',
  onLogoClick: 'setLogoClickCallback',
  preload: 'setPreload',
  controls: 'setMainUIShouldAlwaysShow',
};

const mapMethodsToPlayer: IMethodsToPlayer = {
  play: 'play',
  pause: 'pause',
  stop: 'reset',
  getDuration: 'getDuration',
  getCurrentTime: 'getCurrentTime',
  seekTo: 'seekTo',
  getVolume: 'getVolume',
  setVolume: 'setVolume',
  isMuted: 'isMuted',
  mute: 'mute',
  unMute: 'unmute',
};

interface IPlayableProps extends ICommonProps, IPlayableConfig {}

interface IPlayableState {
  hasBeenPlayed: boolean;
}

class PlayablePlayer extends React.PureComponent<IPlayableProps, IPlayableState> {
  static displayName = 'Playable';
  static defaultProps = {
    logoUrl: '',
    poster: '',
    playButton: null,
    onLogoClick: noop,
  };

  state: IPlayableState = {
    hasBeenPlayed: false
  };
  player: IPlayablePlayerAPI;
  eventEmitter: IEventEmitter;
  containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: IPlayableProps) {
    super(props);

    this.containerRef = React.createRef();
    this.eventEmitter = new EventEmitter();
  }

  componentDidMount() {
    const {
      src, playing, muted, title, showTitle, loop, volume, controls, preload,
      onReady, onDuration, onProgress, logoUrl, onLogoClick, alwaysShowLogo,
    } = this.props;

    this.player = create({
      src,
      autoplay: !!playing,
      playsinline: true,
      muted,
      // width: '100%',
      // height: '100%',
      fillAllSpace: true,
      title: showTitle ? title : '',
      preload,
      loop,
      volume,
      hideOverlay: true,
    });

    if (logoUrl || onLogoClick || alwaysShowLogo) {
      this.player.setLogo(logoUrl);
      this.player.setAlwaysShowLogo(alwaysShowLogo);
      this.player.setLogoClickCallback(onLogoClick);
    }

    this.player.setMainUIShouldAlwaysShow(controls);
    this.player.attachToElement(this.containerRef.current);

    this.player.on(VIDEO_EVENTS.PLAY_REQUEST, () => {
      this.setState({hasBeenPlayed: true});
    });

    this.player.on(ENGINE_STATES.METADATA_LOADED, () => {
      onReady();
      onDuration(this.player.getDuration());
    });

    this.player.on(ENGINE_STATES.PLAYING, () => {
      this.setState({hasBeenPlayed: true});
      this.eventEmitter.emit(EVENTS.PLAYING);
    });

    this.player.on(ENGINE_STATES.PAUSED, () => {
      this.eventEmitter.emit(EVENTS.PAUSED);
    });

    this.player.on(ENGINE_STATES.ENDED, () => {
      this.setState({hasBeenPlayed: false});
      this.eventEmitter.emit(EVENTS.ENDED);
    });

    this.player.on(VIDEO_EVENTS.CURRENT_TIME_UPDATED, currentTime => {
      onProgress(currentTime);
    });
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.destroy();
    }
    this.eventEmitter.removeAllListeners();
  }

  onPlayClick = (): void => {
    this.player.play();
  }

  render() {
    const {showTitle, title, poster, playButton} = this.props;
    const coverStyles = {backgroundImage: poster ? `url(${poster})` : 'none'};

    return (
      <React.Fragment>
        <div 
          ref={this.containerRef}
          className={styles.playerContainer}
        />
        {!this.state.hasBeenPlayed && poster && (
          <div
            className={styles.cover}
            style={coverStyles}
            onClick={this.onPlayClick}
            data-hook="cover"
          >
            <div className={styles.overlay}>
              {showTitle && title && <div data-hook="title" title={title} className={styles.title}>{title}</div>}
              {playButton}
            </div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export const Player: React.ComponentType<any> = playerHOC(PlayablePlayer, mapPropsToPlayer, mapMethodsToPlayer);
