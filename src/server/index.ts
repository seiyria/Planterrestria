
const fs = require('fs');

require('dotenv').config({ silent: true });

try {
  if(process.env.NODE_ENV !== 'production') {
    fs.accessSync('./.env', fs.F_OK);
  }
} catch (e) {
  console.log('Can\'t find the .env file. Please place one in the project root.');
  process.exit();
}

process.on('uncaughtException', e => console.error(e));
process.on('unhandledRejection', reason => console.error(reason));


require('./core/primus');
require('./core/gameloop');
