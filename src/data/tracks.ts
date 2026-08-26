export const trackLines = [
  'Never Gonna Give You Up|Rick Astley|1987|dQw4w9WgXcQ',
  'Despacito|Luis Fonsi ft. Daddy Yankee|2017|kJQP7kiw5Fk',
  'Gangnam Style|PSY|2012|9bZkp7q19f0',
  'Uptown Funk|Mark Ronson ft. Bruno Mars|2014|OPf0YbXqDm0',
];

export type Track = { title: string; artist: string; year: string; videoId: string };
export const tracks: Track[] = trackLines.map((line) => {
  const [title, artist, year, videoId] = line.split('|');
  return { title, artist, year, videoId };
});
