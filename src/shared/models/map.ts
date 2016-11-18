import * as _ from 'lodash';
const islandShape = require('voronoi-map/src/island-shape');
const lavaModule = require('voronoi-map/src/lava');
const mapModule = require('voronoi-map/src/map');
const noisyEdgesModule = require('voronoi-map/src/noisy-edges');
const pointSelectorModule = require('voronoi-map/src/point-selector');
const roadsModule = require('voronoi-map/src/roads');
const style = require('voronoi-map/src/style');
const watershedsModule = require('voronoi-map/src/watersheds');

export class Map{

  map: any;
  constructor(){



    this.map = mapModule({width: 1000.0, height: 1000.0});
    this.map.newIsland(islandShape.makeRadial(1), 1);
    this.map.go0PlacePoints(5, pointSelectorModule.generateRandom(this.map.SIZE.width, this.map.SIZE.height, this.map.mapRandom.seed));
    this.map.go1BuildGraph();
    this.map.assignBiomes();
    this.map.go2AssignElevations();
    this.map.go3AssignMoisture();
    this.map.go4DecorateMap();
  }



    exportPolygons(): Object {
		
      var p;//Center;
      var q;//Corner;
      var r;//Center;
      var s;//Corner;
      var edge;//Edge;



      var dnodes;//Array = [];
      var edges;//Array = [];
      var vnodes;//Array = [];
      var outroads;//Array = [];
      var accum = [];//Array = [];  // temporary accumulator for serialized xml fragments
      var edgeNode;//XML;


      var mapExport = {
        seed: this.map.seed,
        needsMoreRandomness: false,
        centers: [],
        edges: [],
        corners:[]
      };
      _(this.map.centers).each(function (p) {

        accum.splice(0, accum.length);
        var json = {centerID:p.index,
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
                moisture: p.moisture};
        _(p.neighbors).each(function (r) {
            json.neighborIDs.push(r.index );
        });
        _(p.borders).each(function (r) {
            json.edgeIDs.push(r.index );
        });
        _(p.corners).each(function (r) {
            json.cornerIDs.push(r.index );
        });
        accum.push(JSON.stringify(json,null,4));
        mapExport.centers.push(json);
      });

      _(this.map.edges).each(function (p) {
        accum.splice(0, accum.length);
        var json = { edgeID: p.index,
                    river: p.river,
                    atX: p.midpoint.x,
                    aty: p.midpoint.y,
                    center0: p.d0.index,
                    center1: p.d1.index,
                    corner0: p.v0.index,
                    corner1: p.v1.index

        };
        accum.push(JSON.stringify(json,null,4));
        mapExport.centers.push(json);
      });

      _(this.map.corners).each(function (p) {

        accum.splice(0, accum.length);
        var json = { cornerID: p.index,
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
        _(p.touches).each(function (r) {
            json.touchesCenterID.push(r.index );
        });
        _(p.protrudes).each(function (r) {
            json.protrudesEdgeID.push(r.index );
        });
        _(p.adjacent).each(function (r) {
            json.adjacentCornerID.push(r.index );
        });
        accum.push(JSON.stringify(json,null,4));
        mapExport.corners.push(json);
		console.log(JSON.stringify(json));
      });



      /*
        for (var i:String in roads.road) {
        	outroads.push(<road edge={i} contour={roads.road[i]} />.toXMLString());
        }

      */
      //return accum;
      return mapExport;
    }
    }
