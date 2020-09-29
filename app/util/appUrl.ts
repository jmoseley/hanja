const browserSide = !!process.browser;
const appUrl = browserSide ? process.env.NEXT_PUBLIC_APP_ROOT : process.env.APP_ROOT;

export function getAppUrl() {
  return appUrl;
}
