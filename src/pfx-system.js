import ConfigPool from './config-pool.js';

export default class PfxSystem {
  constructor(canvas) {
    this.canvas = canvas || document.getElementById('pfx-system');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    // initialize private vars
    this.configs = [];
    this.prev = 0;
    this.stopScheduled = false;

    // cached vars
    this.context = this.canvas.getContext('2d');
    this.boundStep = this.step.bind(this);
  }

  // TODO: how to set the best initial pool size?
  addConfig(config, options, initialPoolSize = 800) {
    const pool = new ConfigPool(config, options, this.canvas, initialPoolSize);
    this.configs.push(pool);
  }

  step(now) {
    if(this.stopScheduled) {
      this.stopScheduled = false;
      return;
    }

    const dt = now - this.prev;
    this.prev = now;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.configs.length; i++) {
      this.configs[i].step(dt);
    }

    window.requestAnimationFrame(this.boundStep);
  }

  start() {
    this.prev = performance.now();
    window.requestAnimationFrame(this.boundStep);
  }

  stop() {
    this.stopScheduled = true;
  }
}
