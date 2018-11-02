import * as loadScript from 'load-script';
import {ISDKConfig} from '../types';

const stack = {};

const loadSDK = (name, url, onLoaded, onError, onReady) => {
  loadScript(url, err => {
    if (err) {
      onError(err);
    }

    if (onReady) {
      const previousOnReady = window[onReady];

      window[onReady] = () => {
        if (previousOnReady) {
          previousOnReady();
        }
        onLoaded(window[name])
      }
    } else {
      onLoaded(window[name]);
    }
  })
};

const requireSDK = (name, url, onLoaded, onError, resolveRequire) => {
  // @ts-ignore
  window.require([url], sdk => {
    window[name] = resolveRequire(sdk);
    onLoaded(window[name])
  }, err => {
    onError(err);
  })
};

export function getSDK({
  name,
  url,
  onReady,
  isLoaded,
  isRequireAllow,
  resolveRequire,
}: ISDKConfig): Promise<any> {

  if (window[name] && isLoaded && isLoaded(window[name])) {
    return Promise.resolve(window[name])
  }

  return new Promise((resolve, reject) => {

    if (stack[url]) {
      stack[url].push(resolve);
      return;
    } else {
      stack[url] = [resolve];
    }

    const onLoaded = sdk => {
      stack[url].forEach(resolveItem => resolveItem(sdk))
    };

    // @ts-ignore
    if (isRequireAllow && typeof window.define === 'function' && window.define.amd) {
      requireSDK(name, url, onLoaded, reject, resolveRequire);
    } else {
      loadSDK(name, url, onLoaded, reject, onReady);
    }
  })
}
