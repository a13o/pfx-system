class Particle {
  step(dt, api) {
    if (this.y >= this.lifespan) {
      api.despawn(this);
      return;
    }

    this.y += (this.velocity / 1000) * dt;

    api.context.fillStyle = this.color;
    api.context.fillRect(
      (this.x + 0.5) | 0, // round
      (this.y + 0.5) | 0, // round
      this.size,
      this.size
    );
  }
}

class System {
  constructor() {
    this.colors = ['white'];
    this.frequency = 100;
    this.lifespan = 1.0;
    this.lifespanVariance = 0.1;
    this.size = 50;
    this.velocity = 600;
    this.velocityVariance = 0.1;

    this.timePassed = 0;
    this.spawner = {};
  }

  step(dt, api) {
    this.timePassed += dt;

    const spawnRate = (1 / this.frequency) * 1000;
    if (this.timePassed < spawnRate) { return; }

    const spawnCount = (this.timePassed / spawnRate) << 0; // floor
    this.timePassed = (this.timePassed % spawnRate);
    
    for (let i = 0; i < spawnCount; i++) {
      const randIdx = (this.colors.length * Math.random()) << 0; // floor
      const lifespanVariance = (Math.random() * 2 - 1) * this.lifespanVariance;
      const velocityVariance = (Math.random() * 2 - 1) * this.velocityVariance;

      const options = this.spawner;
      options.color = this.colors[randIdx];
      options.lifespan = this.lifespan * (1 + lifespanVariance);
      options.size = this.size;
      options.velocity = this.velocity * (1 + velocityVariance);
      options.x = (window.innerWidth - this.size) * Math.random();
      options.y = -this.size;

      api.spawn(options);
    }
  }
}

export default {
  System,
  Particle,
};
