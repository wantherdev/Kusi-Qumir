export const launchTimestamp = Date.parse('2026-11-01T10:00:00-05:00');
export const officialWebsite = new URL('../', import.meta.url).href;
export function remainingAt(now) {const seconds=Math.max(0,Math.ceil((launchTimestamp-now)/1000));return {days:Math.floor(seconds/86400),hours:Math.floor(seconds%86400/3600),minutes:Math.floor(seconds%3600/60),seconds:seconds%60,total:seconds};}
