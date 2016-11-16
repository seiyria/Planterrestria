
import * as _ from 'lodash';
import { MongoClient } from 'mongodb';

const connectionString = process.env.MONGODB_URI;

let globalPromise;
let $$collections;

export class DbWrapper {

  static get promise() {
    return globalPromise;
  }

  static get $$collections() {
    return $$collections;
  }

  connectionPromise() {
    if(globalPromise) {
      return globalPromise;
    }

    globalPromise = new Promise((resolve, reject) => {
      MongoClient.connect(connectionString, (err, db) => {

        if(err) {
          return reject(err);
        }

        db.collection('players').createIndex({ name: 1 }, { unique: true }, _.noop);

        $$collections = {
          players: db.collection('players')
        };

        resolve(db);
      });
    });

    return globalPromise;
  }
}
