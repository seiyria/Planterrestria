import * as _ from 'lodash';
import { Map } from '../../../shared/models/map';

const islandShape = require('voronoi-map/src/island-shape');
// const lavaModule = require('voronoi-map/src/lava');
const mapModule = require('voronoi-map/src/map');
// const noisyEdgesModule = require('voronoi-map/src/noisy-edges');
const pointSelectorModule = require('voronoi-map/src/point-selector');
// const roadsModule = require('voronoi-map/src/roads');
// const style = require('voronoi-map/src/style');
// const watershedsModule = require('voronoi-map/src/watersheds');

export class WorldMapCreator {

  map: any;

  constructor() {
    this.map = mapModule({ width: 1000.0, height: 1000.0 });
    this.map.newIsland(islandShape.makeRadial(1), 1);
    this.map.go0PlacePoints(5, pointSelectorModule.generateRandom(this.map.SIZE.width, this.map.SIZE.height, this.map.mapRandom.seed));
    this.map.go1BuildGraph();
    this.map.assignBiomes();
    this.map.go2AssignElevations();
    this.map.go3AssignMoisture();
    this.map.go4DecorateMap();
  }


  exportPolygons(): Map {

    /*
    let p;      // Center;
    let q;      // Corner;
    let r;      // Center;
    let s;      // Corner;
    let edge;   // Edge;

    let dnodes = [];
    let edges = [];
    let vnodes = [];
    let outroads = [];
    let edgeNode;
    */

    const mapExport = {
      seed: this.map.seed,
      needsMoreRandomness: false,
      centers: [],
      edges: [],
      corners: []
    };

    _(this.map.centers).each(p => {

      const json = {
        centerID: p.index,
        neighborIDs: [],
        edgeIDs: [],
        cornerIDs: [],
        x: p.x,
        y: p.y,
        water: p.water,
        ocean: p.ocean,
        coast: p.coast,
        border: p.border,
        biome: p.biome,
        elevation: p.elevation,
        moisture: p.moisture
      };

      _(p.neighbors).each(r => {
        json.neighborIDs.push(r.index);
      });

      _(p.borders).each(r => {
        json.edgeIDs.push(r.index);
      });

      _(p.corners).each(r => {
        json.cornerIDs.push(r.index);
      });

      mapExport.centers.push(json);
    });

    _(this.map.edges).each(p => {
      const json = {
        edgeID: p.index,
        river: p.river,
        atX: p.midpoint.x,
        aty: p.midpoint.y,
        center0: p.d0.index,
        center1: p.d1.index,
        corner0: p.v0.index,
        corner1: p.v1.index
      };
      mapExport.centers.push(json);
    });

    _(this.map.corners).each(p => {
      const json = {
        cornerID: p.index,
        touchesCenterID: [],
        protrudesEdgeID: [],
        adjacentCornerID: [],
        x: p.x,
        y: p.y,
        water: p.water,
        ocean: p.ocean,
        coast: p.coast,
        border: p.border.index,
        elevation: p.elevation,
        moisture: p.moisture,
        river: p.river,
        downslope: p.downslope.index

      };

      _(p.touches).each(r => {
        json.touchesCenterID.push(r.index);
      });

      _(p.protrudes).each(r => {
        json.protrudesEdgeID.push(r.index);
      });

      _(p.adjacent).each(r => {
        json.adjacentCornerID.push(r.index);
      });

      mapExport.corners.push(json);
    });

    return new Map(mapExport);
  }
}
