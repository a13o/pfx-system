export default class ConfigPool {
  constructor(config, options, canvas, initialSize) {
    this.system = new config.System();
    Object.assign(this.system, options);

    this.ParticleClass = config.Particle;

    this.pool = [];
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createParticle());
    }

    this.api = {
      spawn: this.spawn.bind(this),
      despawn: this.despawn.bind(this),
      context: canvas.getContext('2d'),
    };

    this.active = [];
  }

  createParticle() {
    const p = new this.ParticleClass();
    p.__markForDelete = false;
    return p;
  }

  step(dt) {
    let delCount = 0;
    for (let i = 0; i < this.active.length; i++) {
      const p = this.active[i];
      if (p.__markForDelete === true) {
        delCount += 1;
        p.__markForDelete = false;
        this.pool.push(p);
      } else {
        p.step(dt, this.api);
        if (delCount > 0) {
          this.active[i - delCount] = p;
        }
      }
    }
    this.active.length -= delCount;

    this.system.step(dt, this.api);
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
}
