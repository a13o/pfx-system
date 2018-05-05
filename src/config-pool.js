export default class ConfigPool {
  constructor(config, options, canvas, initialSize) {
    this.system = new config.System();
    Object.assign(this.system, options);

    this.ParticleClass = config.Particle;

    this.pool = {
      __head: true,
      __next: null,
    };
    this.active = {
      __head: true,
      __next: null,
    };

    let curr = this.pool;
    for (let i = 0; i < initialSize; i++) {
      curr.__next = this.createParticle();
      curr = curr.__next;
    }

    this.api = {
      spawn: this.spawn.bind(this),
      despawn: this.despawn.bind(this),
      context: canvas.getContext('2d'),
    };
  }

  createParticle() {
    const p = new this.ParticleClass();
    p.__markForDelete = false;
    p.__next = null;
    return p;
  }

  step(dt) {
    let curr = this.active.__next;
    let prev = this.active;
    while(curr !== null) {
      if (curr.__markForDelete === true) {
        curr.__markForDelete = false;

        // slice from active list
        prev.__next = curr.__next;

        // add to front of pool
        curr.__next = this.pool.__next;
        this.pool.__next = curr;

        // set the loop pointer
        curr = prev.__next;
      } else {
        curr.step(dt, this.api);
        prev = curr;
        curr = curr.__next;
      }
    }

    this.system.step(dt, this.api);
  }

  spawn(options) {
    const p = this.pool.__next;

    if (p === null) {
      // TODO: set a starvation flag for the debug layer to report on
      return;
    }

    this.pool.__next = p.__next;

    if (!this.optionsKeys) {
      this.optionsKeys = Object.keys(options);
    }

    for (let i = 0; i < this.optionsKeys.length; i++) {
      const key = this.optionsKeys[i];
      p[key] = options[key];
    }

    p.__next = this.active.__next;
    this.active.__next = p;
  }

  despawn(p) {
    p.__markForDelete = true;
  }
}
