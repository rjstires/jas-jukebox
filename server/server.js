const Path = require('path');
const Hapi = require('@hapi/hapi');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const glob = require('glob');
const mm = require('music-metadata');

async function createFilesArray(files) {
  const values = [];
  for (const file of files) {
    const {
      common: { artist, title, album, year, ...common },
      format: { duration, ...format },
      native,
    } = await mm.parseFile(file, { skipCovers: true });
    console.log('file', file)
    values.push({
      duration: duration,
      native,
      format,
      common,
      album,
      artist,
      title,
      year,
      path: file.replace('../client/build', ''),
    });
  }

  return values;
};

const init = async () => {
  const server = new Hapi.Server({
    port: 5000,
    host: 'localhost',
    routes: {
      files: {
        relativeTo: Path.join(__dirname, '../client/build')
      }
    }
  });

  await server.register([Inert, Vision]);

  server.views({
    engines: {
      html: require('handlebars')
    },
    relativeTo: __dirname,
    path: 'templates'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: async function (request, h) {
      console.time('glob');
      const files = glob.sync('../client/build/assets/songs/**/*.{mp3,m4a}');
      console.timeEnd('glob');

      console.time('parse');
      const values = await createFilesArray(files);
      console.timeEnd('parse');

      const script = `
        <script lang="javascript">
          window.__FILES__ = ${JSON.stringify(values)};
        </script>
      `;

      return h.view('index', { script });
    }
  });

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: '.',
        redirectToSlash: true
      }
    }
  });

  await server.start();

  console.log('Server running at:', server.info.uri);
};

init();
