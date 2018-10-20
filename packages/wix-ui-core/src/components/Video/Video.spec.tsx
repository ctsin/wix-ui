import * as React from 'react';
import * as eventually from 'wix-eventually';
import {createDriver} from './Video.driver.private';
import {Video} from './';

describe('Video', () => {
  // Since this runs in a browser avoid sending HTTP requests over network.
  const videoUrl = 'data:video/mp4,never-gonna-give-you-up.mp4';

  describe('Video Wrapper', () => {
    describe('width prop', () => {
      it('should not be present by default', () => {
        const driver = createDriver(<Video src={videoUrl}/>);
        expect(driver.getWidth()).toBeFalsy();
      });

      it('should set initial value', () => {
        const driver = createDriver(<Video width={400} src={videoUrl}/>);
        expect(driver.getWidth()).toBe('400px');
      });
    });

    describe('height prop', () => {
      it('should not be present by default', () => {
        const driver = createDriver(<Video src={videoUrl}/>);
        expect(driver.getHeight()).toBeFalsy();
      });

      it('should set initial value', () => {
        const driver = createDriver(<Video height={225} src={videoUrl}/>);
        expect(driver.getHeight()).toBe('225px');
      });
    });

    describe('fillAllSpace', () => {
      it('should set width and height in 100%', () => {
        const driver = createDriver(<Video fillAllSpace src={videoUrl}/>);
        expect(driver.getRootDOMNode().style.width).toBe('100%');
        expect(driver.getRootDOMNode().style.height).toBe('100%');
      });
    });
  });

  describe('Playable player', () => {
    const playableVideoUrl = 'data:video/mp4,never-gonna-give-you-up.mp4';
    const imageUrl = 'data:image/jpeg,never-gonna-run-around.jpg';

    describe('player type', () => {
      it('should set initial value', () => {
        const driver = createDriver(<Video src={playableVideoUrl}/>);
        expect(driver.getPlayerDisplayName()).toBe('Playable');
      });

      it('should set array for src', () => {
        const driver = createDriver(<Video src={[playableVideoUrl]}/>);
        expect(driver.getPlayerDisplayName()).toBe('Playable');
      });
    });

    describe('muted prop', () => {
      it('should not be muted by default',() => {
        const driver = createDriver(<Video src={playableVideoUrl}/>);
        expect(driver.isMuted()).toBe(false);
      });

      it('should set initial value', () => {
        const driver = createDriver(<Video muted src={playableVideoUrl}/>);
        expect(driver.isMuted()).toBe(true);
      });

      it('should update value', () => {
        const driver = createDriver(<Video muted src={playableVideoUrl}/>);
        expect(driver.isMuted()).toBe(true);

        driver.setProp('muted', false);
        expect(driver.isMuted()).toBe(false);

        driver.setProp('muted', true);
        expect(driver.isMuted()).toBe(true);
      });
    });

    describe('cover', () => {
      it('should be present', () => {
        const driver = createDriver(<Video config={{playable: {poster: imageUrl}}} src={playableVideoUrl}/>);
        expect(driver.hasCover()).toBe(true);
      });
    });

    describe('title', () => {
      it('should be present', () => {
        const driver = createDriver(
          <Video
            config={{
              playable: {poster: imageUrl, title: 'Awesome'}
            }}
            src={playableVideoUrl}
          />
        );
        expect(driver.hasTitle()).toBe(true);
      });
    });

    describe('playButton', () => {
      it('should be presented', () => {
        const driver = createDriver(
          <Video
            config={{
              playable: {
                poster: imageUrl,
                title: 'Awesome',
                playButton: <div data-hook="play-button">Play</div>
              }
            }}
            src={playableVideoUrl}
          />
        );
        expect(driver.getRootDOMNode().querySelector('[data-hook="play-button"]')).toBeTruthy();
      });
    });
  });

  describe('Youtube player', () => {
    const YoutubeVideoUrl = 'data:video/mp4,never-gonna-give-you-up.mp4';

    describe('player type', () => {
      it('should set initial value', () => {
        const driver = createDriver(<Video src={YoutubeVideoUrl}/>);
        expect(driver.getPlayerDisplayName()).toBe('Youtube');
      });
    });
  });

    // describe('playing prop', () => {
    //   it('should not playing by default', () => {
    //     const driver = createDriver(<Video/>);
    //     expect(driver.isAutoPlaying()).toBe(false);
    //   });
    //
    //   it('should set initial value', () => {
    //     const driver = createDriver(<Video playing/>);
    //     expect(driver.isAutoPlaying()).toBe(true);
    //   });
    // });

    // describe('logo', () => {
    //   it('should be hidden by default', () => {
    //     const driver = createDriver(
    //       <Video />
    //     );
    //
    //     expect(driver.getLogoSrc()).toBeFalsy();
    //   });
    //
    //   it('should be shown and clickable if callback passed', () => {
    //     const callback = jest.fn();
    //     const driver = createDriver(
    //       <Video onLogoClick={callback} />
    //     );
    //
    //     driver.clickLogo();
    //
    //     expect(callback).toBeCalled();
    //   });
    //
    //   it('should be presented', () => {
    //     const driver = createDriver(
    //       <Video
    //         logoUrl={imageUrl}
    //       />
    //     );
    //
    //     expect(driver.getLogoSrc()).toBe(imageUrl);
    //   });
    // });
});