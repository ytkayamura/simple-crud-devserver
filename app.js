import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Character from './character';

const app = express();
const port = process.env.PORT || 3000;
const dbUrl = 'mongodb://localhost/crud';

if (process.env.NODE_ENV !== 'production') {
  /* eslint-disable global-require, import/no-extraneous-dependencies */
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const config = require('./webpack.config.dev.babel').default;
  const compiler = webpack(config);

  app.use(webpackHotMiddleware(compiler));
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }));
}

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// from simple-crud
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


mongoose.connect(dbUrl, (dbErr) => {
  if (dbErr) {
    throw new Error(dbErr);
  } else {
    console.log('db connected');
  }

  app.post('/api/characters', (request, response) => {
    const { name, age } = request.body;

    new Character({
      name,
      age,
    }).save((err) => {
      if (err) {
        response.status(500);
      } else {
        Character.find({}, (findErr, characterArray) => {
          if (findErr) {
            response.status(500).send();
          } else {
            response.status(200).send(characterArray);
          }
        });
      }
    });
  });

  app.get('/api/characters', (request, response) => {
    Character.find({}, (err, characterArray) => {
      if (err) {
        response.status(500).send();
      } else {
        response.status(200).send(characterArray);
      }
    });
  });

  app.put('/api/characters', (request, response) => {
    const { id } = request.body;
    Character.findByIdAndUpdate(id, { $inc: { age: 1 } }, (err) => {
      if (err) {
        response.status(500).send();
      } else {
        Character.find({}, (findErr, characterArray) => {
          if (findErr) {
            response.status(500).send();
          } else {
            response.status(200).send(characterArray);
          }
        });
      }
    });
  });

  app.delete('/api/characters', (request, response) => {
    //const { id } = request.body;
    Character.findByIdAndRemove((id, err) => {
      if (err) {
        response.status(500).send();
      } else {
        Character.find({}, (findErr, characterArray) => {
          if (findErr) {
            response.status(500).send();
          } else {
            response.status(200).send(characterArray);
          }
        });
      }
    });
  });

  /*
  app.listen(port, err => {
    if (err) throw new Error(err)
    else console.log(`listening on port ${port}`)
  })
  */
  console.log(`Served: http://localhost:${port}`);
  app.listen(port, (err) => {
    if (err) {
      console.error(err);
    } else {
      console.info(`==> 🌎  Listening on port ${port}. Open up http://localhost:${port}/ in your browser.`);
    }
  });
});
