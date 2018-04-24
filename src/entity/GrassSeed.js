import Entity from "./Entity.js";
import Grass from "./Grass";
export default class GrassSeed extends Entity{
    name = 'GrassSeed';
    constructor(energy, gene) {
        super();
        this.energy = energy;
        this.gene = gene || Grass.defauleGene;
    }
    released(grid) {
        grid.entity = null;
        new Grass(grid.world, grid.x, grid.y, this.gene, this.energy);
    }
}