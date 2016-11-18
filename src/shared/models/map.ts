
// TODO make center, edge, corner models

export class Map {
  seed: string;
  needsMoreRandomness: boolean;
  centers: Array<any>;
  edges:   Array<any>;
  corners: Array<any>;

  constructor({ seed, needsMoreRandomness, centers, edges, corners }) {
    this.seed = seed;
    this.needsMoreRandomness = needsMoreRandomness;
    this.centers = centers;
    this.edges = edges;
    this.corners = corners;
  }
}
