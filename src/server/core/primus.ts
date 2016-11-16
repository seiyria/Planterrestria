
import * as fs from 'fs';
import * as _ from 'lodash';

const express = require('express');
const Primus = require('primus');

const getAllSocketFunctions = (dir) => {
  let results = [];

  const list = fs.readdirSync(dir);
  _.each(list, basefilename => {
    const filename = `${dir}/${basefilename}`;
    const stat = fs.statSync(filename);
    if(stat && stat.isDirectory()) results = results.concat(getAllSocketFunctions(filename));
    else if(_.includes(basefilename, '.socket')) results.push(filename);
  });

  return results;
};

export const primus = () => {

  new (require('./database').DbWrapper)().connectionPromise();

  const serve = express();

  const finalhandler = require('finalhandler');

  const server = require('http').createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    serve(req, res, finalhandler(req, res));
  });

  server.listen(process.env.PORT || 8080);

  const primus = new Primus(server, { iknowhttpsisbetter: true, parser: 'JSON', transformer: 'websockets' });
  primus.plugin('emit', require('primus-emit'));

  const normalizedPath = require('path').join(__dirname, '..');

  const allSocketFunctions = getAllSocketFunctions(normalizedPath);
  const allSocketRequires = _.map(allSocketFunctions, require);

  primus.on('connection', spark => {
    const respond = (data) => {
      spark.write(data);
    };

    _.each(allSocketRequires, obj => {
      obj.operate({ socket: spark, primus, respond: (data) => {
        data.event = obj.event;
        respond(data);
      }});
    });

  });

  if(process.env.NODE_ENV !== 'production') {
    primus.save(`${require('app-root-path')}/src/client/app/primus.gen.js`);
  }
};

primus();
