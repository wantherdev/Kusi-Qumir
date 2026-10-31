import { launchTimestamp } from '../frontend/public/lanzamiento/launch-config.mjs';

// Runs before the page body, including direct links to catalog/legal pages.
export function launchGate(base) {
  return `<script data-launch-gate>if(Date.now()<${launchTimestamp}){window.location.replace(${JSON.stringify(base + 'lanzamiento/')});}</script>`;
}
