import {Video} from '../src/components/Video';

export default {
  category: 'Components',
  storyName: 'Video',
  component: Video,
  componentPath: '../src/components/Video/Video.tsx',

  componentProps: {
    src: 'http://vjs.zencdn.net/v/oceans.mp4',
    width: 400,
    height: 225,
    controls: true,
    config: {
      playable: {
        playButton: 'Play',
        preload: 'auto',
        title: 'Awesome title',
        poster: 'https://images-vod.wixmp.com/d0220cbc-4355-4bc0-8ebe-53e9ab8843ba/images/23a7996667c04ebc8bd7e9b6141e30cb~mv2/v1/fill/w_400,h_225,q_85,usm_0.66_1.00_0.01/file.jpg',
        logoUrl: 'https://images-wixmp-01bd43eabd844aac9eab64f5.wixmp.com/images/White+Wix+logo+Assets+Transparent.png/v1/fit/w_475,h_150/White+Wix+logo+Assets+Transparent.png',
        alwaysShowLogo: true,
      },
    }
  },

  exampleProps: {
    onPlay: () => 'Triggered onPlay',
    onPause: () => 'Triggered onPause',
    onEnd: () => 'Triggered onEnd'
  }
};
