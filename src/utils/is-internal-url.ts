function isInternalUrl(url: string | undefined): url is string {
  return !!url && /^\/([^/]|$)/.test(url);
}
export default isInternalUrl;
