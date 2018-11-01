import * as React from 'react';
import * as eventually from 'wix-eventually';
import {createDriver} from './Video.driver.private';
import {Video} from './';

describe('Video', () => {
  const VIDEO_SRC = 'data:video/mp4,never-gonna-give-you-up.mp4';
  const IMAGE_SRC = 'data:image/jpeg,never-gonna-run-around.jpg';

  describe('Video Wrapper', () => {
    describe('width prop', () => {
      it('should not be present by default', () => {
        const driver = createDriver(<Video src={VIDEO_SRC}/>);
        expect(driver.getWidth()).toBeFalsy();
      });

      it('should set initial value', () => {
        const driver = createDriver(<Video width={400} src={VIDEO_SRC}/>);
        expect(driver.getWidth()).toBe('400px');
      });
    });

    describe('height prop', () => {
      it('should not be present by default', () => {
        const driver = createDriver(<Video src={VIDEO_SRC}/>);
        expect(driver.getHeight()).toBeFalsy();
      });

      it('should set initial value', () => {
        const driver = createDriver(<Video height={225} src={VIDEO_SRC}/>);
        expect(driver.getHeight()).toBe('225px');
      });
    });

    describe('fillAllSpace', () => {
      it('should set width and height in 100%', () => {
        const driver = createDriver(<Video fillAllSpace src={VIDEO_SRC}/>);
        expect(driver.getRootDOMNode().style.width).toBe('100%');
        expect(driver.getRootDOMNode().style.height).toBe('100%');
      });
    });
  });

  describe('Playable player', () => {
    describe('player type', () => {
      it('should set video url to Playable player', () => {
        const driver = createDriver(<Video src={VIDEO_SRC}/>);
        expect(driver.getPlayerDisplayName()).toBe('Playable');
      });

      it('should set array of video source to Playable player', () => {
        const driver = createDriver(<Video src={[VIDEO_SRC]}/>);
        expect(driver.getPlayerDisplayName()).toBe('Playable');
      });
    });

    describe('muted prop', () => {
      it('should not be muted by default',() => {
        const driver = createDriver(<Video src={VIDEO_SRC}/>);
        expect(driver.isMuted()).toBe(false);
      });

      it('should set initial value', () => {
        const driver = createDriver(<Video muted src={VIDEO_SRC}/>);
        expect(driver.isMuted()).toBe(true);
      });

      it('should update value', () => {
        const driver = createDriver(<Video muted src={VIDEO_SRC}/>);
        expect(driver.isMuted()).toBe(true);

        driver.setProp('muted', false);
        expect(driver.isMuted()).toBe(false);

        driver.setProp('muted', true);
        expect(driver.isMuted()).toBe(true);
      });
    });

    describe('cover', () => {
      it('should be present', () => {
        const driver = createDriver(<Video config={{playable: {poster: IMAGE_SRC}}} src={VIDEO_SRC}/>);
        expect(driver.hasCover()).toBe(true);
      });
    });

    describe('title', () => {
      it('should has appropriate title', () => {
        const TITLE = 'Awesome';
        const driver = createDriver(
          <Video
            config={{
              playable: {poster: IMAGE_SRC, title: TITLE}
            }}
            src={VIDEO_SRC}
          />
        );
        expect(driver.hasTitle()).toBe(true);
        expect(driver.getTitle()).toBe(TITLE);
      });
    });

    describe('playButton', () => {
      it('should be presented', () => {
        const driver = createDriver(
          <Video
            config={{
              playable: {
                poster: IMAGE_SRC,
                title: 'Awesome',
                playButton: <div data-hook="play-button">Play</div>
              }
            }}
            src={VIDEO_SRC}
          />
        );
        expect(driver.getRootDOMNode().querySelector('[data-hook="play-button"]')).toBeTruthy();
      });
    });
  });

  describe('DailyMotion player', () => {
    const DAILY_MOTION_LINK = 'https://www.dailymotion.com/video/x5e9eog';

    describe('player type', () => {
      it('should set DailyMotion link to appropriate player', () => {
        const driver = createDriver(<Video src={DAILY_MOTION_LINK}/>);
        expect(driver.getPlayerDisplayName()).toBe('DailyMotion');
      });
    });
  });

  describe('Facebook player', () => {
    const FACEBOOK_LINK = 'https://www.facebook.com/facebook/videos/10153231379946729/';

    describe('player type', () => {
      it('should set Facebook link to appropriate player', () => {
        const driver = createDriver(<Video src={FACEBOOK_LINK}/>);
        expect(driver.getPlayerDisplayName()).toBe('Facebook');
      });
    });
  });

  describe('Twitch player', () => {
    const TWITCH_LINK = 'https://www.twitch.tv/videos/106400740';

    describe('player type', () => {
      it('should set Facebook link to appropriate player', () => {
        const driver = createDriver(<Video src={TWITCH_LINK}/>);
        expect(driver.getPlayerDisplayName()).toBe('Twitch');
      });
    });
  });

  describe('Vimeo player', () => {
    const VIMEO_LINK = 'https://vimeo.com/90509568';

    describe('player type', () => {
      it('should set Facebook link to appropriate player', () => {
        const driver = createDriver(<Video src={VIMEO_LINK}/>);
        expect(driver.getPlayerDisplayName()).toBe('Vimeo');
      });
    });
  });

  describe('Youtube player', () => {
    const YOUTUBE_LINK = 'https://www.youtube.com/watch?v=oUFJJNQGwhk';

    describe('player type', () => {
      it('should set Youtube link to appropriate player', () => {
        const driver = createDriver(<Video src={YOUTUBE_LINK}/>);
        expect(driver.getPlayerDisplayName()).toBe('YouTube');
      });
    });
  });
});