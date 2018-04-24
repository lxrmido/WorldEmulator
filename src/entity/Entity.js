export default class Entity {
    char = 'E0';
    name = 'Entity';
    static efaultGene = 'ENTITY000000000000000000';
    geneMutation (randomSeed) {
        let i = Math.floor(randomSeed * 24);
        var s = this.gene.split('');
        s[i] = this.nextGene(s[i]);
        this.gene = s.join('');
    }
    nextGene (char) {
        let c = char.charCodeAt(0);
        if (c >= 65 && c < 90) {
            c += 1;
        } else if (c === 90) {
            c = 65;
        } else if (c >= 97 && c < 122) {
            c += 1;
        } else if (c === 122) {
            c = 97;
        } else if (c >= 48 && c < 57){
            c += 1;
        } else {
            c = 48;
        }
        return String.fromCharCode(c);
    }
    absorb (entity) {

    }
}