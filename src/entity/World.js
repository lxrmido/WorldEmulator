export default class World {
    width = 0;
    height = 0;
    map = [];
    wind = {
        x: 0,
        y: 0
    };
    container = [];
    age = 0;

    constructor (width, height) {
        this.width = width;
        this.height = height;
        for (let i = 0; i < width * height; i ++) {
            this.map[i] = {
                world: this,
                energy: 100,
                charger: null,
                x: i % this.width,
                y: Math.floor(i / this.width)
            };
        }    
    }

    registerGrid (x, y, entity) {
        let g = this.getGrid(x, y);
        if (!g) {
            return false;
        }
        if (g.entity == null) {
            g.entity = entity;
            return g;
        } else {
            // Already used.
            process.nextTick(() => {
                g.entity.absorb(entity);
            })
            return false;
        }
    }

    getGrid (x, y) {
        if (x >= this.width || y > this.height || x < 0 || y < 0) {
            // Beyond edge
            return false;
        }
        return this.map[y * this.width + x];
    }

    addEnergy (x, y, energy) {
        this.getGrid(x, y).energy += energy;
    }

    releaseToOtherGrid (fromX, fromY, energyCarry, entity) {
        let targetX = fromX + Math.ceil(this.wind.x * energyCarry);
        let targetY = fromY + Math.ceil(this.wind.y * energyCarry);
        let g = this.registerGrid(targetX, targetY, entity);
        if (g) {
            process.nextTick(() => {
                entity.released(g);
            });
        }
    }

    registerLiving (entity) {
        this.container.push(entity);
    }

    printMap () {
        for (let i = 0; i < this.height; i ++) {
            let s = '';
            for (let j = 0; j < this.width; j ++) {
                let g = this.getGrid(j, i);
                if (g.entity) {
                    s += g.entity.char;
                } else {
                    s += '  ';
                }
            }
            console.log(s);
        }
    }

    tick () {
        // console.log('Wind:' + this.wind.x + ',' + this.wind.y);
        this.age ++;
        this.wind.x += (0.5 - Math.random()) / 10;
        this.wind.y += (0.5 - Math.random()) / 10;
        this.container.forEach((x) => {
            x.tick();
        });
        // this.printMap();
    }
}