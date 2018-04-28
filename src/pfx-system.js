class ConfigPool {
  constructor(config, initialSize) {
    this.config = config;

    this.pool = [];
    for(let i = 0; i < initialSize; i++) {
      this.pool.push(this.createParticle());
    }

    this.api = {
      spawn: this.spawn.bind(this),
      despawn: this.despawn.bind(this),
    };

    this.active = [];
  }

  step(dt, context) {
    let delCount = 0;
    for (let i = 0; i < this.active.length; i++) {
      const p = this.active[i];
      if (p.__markForDelete === true) {
        delCount += 1;
        delete p.__markForDelete;
        this.pool.push(p);
      } else {
        p.step(dt, context, this.api);
        if (delCount > 0) {
          this.active[i - delCount] = p;
        }
      }
    }
    this.active.length -= delCount;

    this.config.step(dt, context, this.api);
  }

  spawn(options) {
    let p;
    if (this.pool.length > 0) {
      p = this.pool[this.pool.length - 1];
      this.pool.length = this.pool.length - 1;
    } else {
      p = this.createParticle();
    }

    if (!this.optionsKeys) {
      this.optionsKeys = Object.keys(options);
    }

    for (let i = 0; i < this.optionsKeys.length; i++) {
      const key = this.optionsKeys[i];
      p[key] = options[key];
    }

    this.active.push(p);
  }

  despawn(p) {
    p.__markForDelete = true;
  }

  createParticle() {
    return new this.config.ParticleClass();
  }
}

export default class PfxSystem {
  constructor(canvas) {
    this.canvas = canvas || document.getElementById('pfx-system');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.context = this.canvas.getContext('2d');

    this.configs = [];
    this.prev = 0;
    this.stopScheduled = false;

    this.boundStep = this.step.bind(this);
  }

  step() {
    if(this.stopScheduled) {
      this.stopScheduled = false;
      return;
    }

    const now = Date.now();
    const dt = now - this.prev;
    this.prev = now;

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.configs.forEach((config) => {
      config.step(dt, this.context);
    });

    window.requestAnimationFrame(this.boundStep);
  }

  start() {
    this.prev = Date.now();
    window.requestAnimationFrame(this.boundStep);
  }

  stop() {
    this.stopScheduled = true;
  }

  addConfig(config, options) {
    // TODO: how to set the best initial pool size?
    const instance = new config.System();
    instance.ParticleClass = config.Particle;
    Object.assign(instance, options);
    const pool = new ConfigPool(instance, 800);
    this.configs.push(pool);
  }
}
