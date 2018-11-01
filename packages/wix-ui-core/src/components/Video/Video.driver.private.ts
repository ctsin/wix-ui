/**
 * Private driver, will not be exposed in testkit
 */
import { IVideoProps } from './Video';
import * as React from 'react';
import {mount} from 'enzyme';

export const createDriver = (Component: React.ReactElement<IVideoProps>) => {
  let player;

  const ClonedComponent = React.cloneElement(Component, {
    playerRef: r => player = r,
  });

  const wrapper = mount(ClonedComponent);
  const rootDOMNode = wrapper.getDOMNode() as HTMLElement;

  return {
    getRootDOMNode: () => rootDOMNode,
    getWidth: () => rootDOMNode.style.width,
    getHeight: () => rootDOMNode.style.height,
    setProp: (prop, value) => wrapper.setProps({[prop]: value}),
    isMuted: () => player.isMuted(),
    getPlayerDisplayName: () => player.constructor.displayName,

    hasCover: () => wrapper.find('[data-hook="cover"]').length === 1,
    hasTitle: () => wrapper.find('[data-hook="title"]').length === 1,
    getTitle: () => wrapper.find('[data-hook="title"]').text(),
    getLogoSrc: () => rootDOMNode.querySelector('[data-hook="company-logo"]').getAttribute('src'),
    clickLogo: () => {
      const event = new MouseEvent('click', {bubbles: true});

      rootDOMNode.querySelector('[data-hook="company-logo"]').dispatchEvent(event);
    }
  };
};
