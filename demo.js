import PfxSystem from './src/pfx-system.js';
import RainConfig from './src/config/pfx-config-rain.js';

const pfx = new PfxSystem();
pfx.addConfig(RainConfig, {
  colors: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
  frequency: 4000, // pfx/sec
  lifespan: 800, // px
  lifespanVariance: 0.05, // %
  size: 7, // px
  velocity: 800, // px/sec
  velocityVariance: 0.5, // %
});

pfx.start();

document.getElementById('btn-start').addEventListener('click', () => {
  pfx.start();
});
document.getElementById('btn-stop').addEventListener('click', () => {
  pfx.stop();
});