export const compressUrl = (url: string): string => {
  if (!url) return url;
  const videoExtensions = ["mp4", "mov", "avi", "webm", "mkv"];
  const match = url.match(/\.([a-zA-Z0-9]+)(\?.*)?$/);
  if (match && videoExtensions.includes(match[1].toLowerCase())) {
    return url.replace(/\.([a-zA-Z0-9]+)(\?.*)?$/, "-thumbnail.png$2");
  }
  return url.replace(/(\.[a-zA-Z0-9]+)(\?.*)?$/, "-256$1$2");
};
