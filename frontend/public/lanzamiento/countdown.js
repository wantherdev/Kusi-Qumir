import { remainingAt, officialWebsite } from './launch-config.mjs';
let timer;
function update() {
 const remaining=remainingAt(Date.now());
 for(const unit of ['days','hours','minutes','seconds'])document.getElementById(unit).textContent=String(remaining[unit]).padStart(2,'0');
 if(remaining.total===0){clearInterval(timer);document.getElementById('launch-title').textContent='¡Nuestra web ya está disponible!';document.getElementById('launch-status').textContent='Te llevamos a la web oficial de Kusi Q’umir.';document.querySelector('.launch-website').hidden=false;window.location.replace(officialWebsite);}
 return remaining.total;
}
if(update()>0)timer=setInterval(update,1000);
window.addEventListener('pageshow',update);

document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
