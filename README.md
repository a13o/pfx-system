A plugin friendly web canvas pfx system.

The idea is that packages/pfx-system can be distributed and updated independently from effects like packages/pfx-config-rain. A core team can maintain the performance, portability, and API while anyone can distribute effects.

Check out demo.js for an example of how to use the lib.

I got somewhere around 5,000 particles at 60 FPS which is pretty good considering it's using canvas to set the colors. Using a single color or a sprite where the draw calls can be batched would yield a much higher max. Porting the engine to WebGL would blow all this out of the water.

It uses an object pool for the particles so there's no runtime hiccups from garbage collection.

The system is smart enough to pause when the user has switched tabs or minimized the page.