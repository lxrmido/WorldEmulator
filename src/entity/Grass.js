import Entity from "./Entity.js";
import GrassSeed from "./GrassSeed.js";
export default class Grass extends Entity{
    age = 0;
    energy = 0;
    emotion = 0;
    size = 0;
    world;
    x;
    y;
    seedsContainer = [];
    alive = true;
    gene;
    char = 'G0';
    name = 'Grass';
    static defauleGene = 'NORMALGRASS0000000000000';
    constructor(world, x, y, gene, energy) {
        super();
        this.energy = energy || 0;
        this.world = world;
        this.x = x;
        this.y = y;
        this.gene = gene || Grass.defauleGene;
        let grid = world.registerGrid(x, y, this);
        if (grid) {
            if (grid.energy > 0) {
                grid.energy -= 1;
                this.energy += 1;
            }
            process.nextTick(() => {
                world.registerLiving(this);
            });
        }
    }
    info() {
        return {
            age: this.age,
            energy: this.energy,
            emotion: this.emotion,
            size: this.size,
            x: this.x,
            y: this.y,
            alive: this.alive,
            seedsContainer: (this.seedsContainer)
        };
    }
    inChaos() {
        let r = Math.random();
        let c = r < 0.00001;
        if (c) {
            this.geneMutation(r * 10000);
        }
        return c;
    }
    canGrowSeeds() {
        if (this.inChaos()) {
            return true;
        }
        return this.age > 100 && this.energy > 10 && this.emotion >= 0 && this.size > 10;
    }
    canGrowUp() {
        if (this.inChaos()) {
            return true;
        }
        // Max size I can grown
        if (this.size >= 80) {
            return false;
        }
        if (this.energy > this.size * 2) {
            return true;
        }
        return false;
    }
    canBeAlive() {
        return this.energy + this.size * 2 * 1.618 > 0;
    }
    growSeeds() {
        if (this.seedsContainer.length < this.size) {
            this.energy -= 10;
            this.seedsContainer.push(1);
            return true;
        }
        for (let i = 0; i < this.size; i++) {
            if (this.seedsContainer[i] === 0) {
                this.energy -= 10;
                this.seedsContainer[i] = 1;
                return true;
            }
        }
        return false;
    }
    seedsGrowUp() {
        for (let i = 0; i < this.seedsContainer.length; i++) {
            if (this.seedsContainer[i] > 0 && this.seedsContainer[i] < 10) {
                if (this.energy > 0) {
                    this.energy -= 2;
                    this.seedsContainer[i]++;
                }
            }
        }
    }
    growUp() {
        this.energy -= this.size * 2;
        this.size ++;
        this.char = 'G' + Math.ceil(this.size / 10);
    }
    canThrowSeed() {
        if (this.energy < 10) {
            // Not enough energy to throw
            return false;
        }
        for (let i = 0; i < this.seedsContainer.length; i++) {
            if (this.seedsContainer[i] >= 10) {
                // Seed's ready
                return i;
            }
        }
        return false;
    }
    throwSeed(n) {
        this.seedsContainer[n] = 0;
        this.energy -= 10;
        // By rule, only half energy can be trans
        this.world.releaseToOtherGrid(this.x, this.y, 5, new GrassSeed(5, this.gene));
    }
    end() {
        this.alive = false;
        this.world.addEnergy(Math.floor(this.energy / 10));
        this.energy = 0;
        console.log('Everything could be ended.');
    }
    tick() {
        if (!this.alive) {
            return false;
        }
        this.age++;
        this.energy++;
        this.seedsGrowUp();
        if (this.canGrowSeeds()) {
            this.growSeeds();
        }
        if (this.canGrowUp()) {
            this.growUp();
        }
        if (!this.canBeAlive()) {
            this.end();
        }
        let seedSlot = this.canThrowSeed();
        if (seedSlot !== false) {
            this.throwSeed(seedSlot);
        }
        // console.log(JSON.stringify(this.info()));
        return true;
    }
}
