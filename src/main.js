// let Grass = require('./entity/Grass.js');
// let World = require('./entity/World.js');

import World from './entity/World';
import Grass from './entity/Grass';
import koa from 'koa';
import serve from 'koa-static';
import mount from 'koa-mount';

let world = new World(100, 50);
new Grass(world, 50, 25);

setInterval(() => {
    world.tick()
}, 100);

let app = new koa();
let staticApp = new koa();
let serviceApp = new koa();

staticApp.use(serve('resource/'));

app.use(mount('/', staticApp));
app.use(mount('/api', serviceApp));

serviceApp.use((ctx, next) => {
    console.log(ctx);
    ctx.body = 'ok';
});

app.listen(3003);