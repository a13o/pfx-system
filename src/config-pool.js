const MARK_FOR_DELETE = Symbol('mark-for-delete');
const NEXT = Symbol('next');

export default class ConfigPool {
  constructor(config, options, canvas, initialSize) {
    this.system = new config.System();
    Object.assign(this.system, options);

    this.ParticleClass = config.Particle;

    this.pool = { [NEXT]: null };
    this.active = { [NEXT]: null };

    let curr = this.pool;
    for (let i = 0; i < initialSize; i++) {
      curr[NEXT] = this.createParticle();
      curr = curr[NEXT];
    }

    this.api = {
      spawn: this.spawn.bind(this),
      despawn: this.despawn.bind(this),
      context: canvas.getContext('2d'),
    };
  }

  createParticle() {
    const p = new this.ParticleClass();
    p[MARK_FOR_DELETE] = false;
    p[NEXT] = null;
    return p;
  }

  step(dt) {
    let curr = this.active[NEXT];
    let prev = this.active;
    while(curr !== null) {
      if (curr[MARK_FOR_DELETE] === true) {
        curr[MARK_FOR_DELETE] = false;

        // slice from active list
        prev[NEXT] = curr[NEXT];

        // add to front of pool
        curr[NEXT] = this.pool[NEXT];
        this.pool[NEXT] = curr;

        // set the loop pointer
        curr = prev[NEXT];
      } else {
        curr.step(dt, this.api);
        prev = curr;
        curr = curr[NEXT];
      }
    }

    this.system.step(dt, this.api);
  }

  spawn(options) {
    const p = this.pool[NEXT];

    if (p === null) {
      // TODO: set a starvation flag for the debug layer to report on
      return;
    }

    this.pool[NEXT] = p[NEXT];

    if (!this.optionsKeys) {
      this.optionsKeys = Object.keys(options);
    }

    for (let i = 0; i < this.optionsKeys.length; i++) {
      const key = this.optionsKeys[i];
      p[key] = options[key];
    }

    p[NEXT] = this.active[NEXT];
    this.active[NEXT] = p;
  }

  despawn(p) {
    p[MARK_FOR_DELETE] = true;
  }
}
