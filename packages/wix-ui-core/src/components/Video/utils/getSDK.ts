import * as loadScript from 'load-script';

const stack = {};

export function getSDK(
  url: string,
  sdkGlobal: string,
  sdkReady: string | null = null,
  isSDKLoaded: Function = () => true
): Promise<any> {

  if (window[sdkGlobal] && isSDKLoaded(window[sdkGlobal])) {
    return Promise.resolve(window[sdkGlobal])
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

    if (sdkReady) {
      const previousOnReady = window[sdkReady];

      window[sdkReady] = () => {
        if (previousOnReady) {
          previousOnReady();
        }
        onLoaded(window[sdkGlobal])
      }
    }

    loadScript(url, err => {
      if (err) {
        reject(err);
      }
      if (!sdkReady) {

        // @ts-ignore
        if (!window[sdkGlobal] && "function" === typeof define && define.amd) {
          // @ts-ignore
          require([url], player => {
            window[sdkGlobal] = { Player: player };
            onLoaded(window[sdkGlobal])
          });
        } else {
          onLoaded(window[sdkGlobal])
        }
      }
    })

  })
}
