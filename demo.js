import PfxSystem from './src/pfx-system.js';
import RainConfig from './src/config/pfx-config-rain.js';

const pfx = new PfxSystem();

const freq = 4000;
pfx.addConfig(RainConfig, {
  colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
  frequency: freq, // pfx/sec
  lifespan: 800, // px
  lifespanVariance: 0.05, // %
  size: 7, // px
  velocity: 600, // px/sec
  velocityVariance: 0.5, // %
}, freq * 1.25);

pfx.start();

document.getElementById('btn-start').addEventListener('click', () => {
  pfx.start();
});
document.getElementById('btn-stop').addEventListener('click', () => {
  pfx.stop();
});