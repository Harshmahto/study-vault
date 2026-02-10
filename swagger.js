import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Study Vault API',
    description: 'API Documentation'
  },
  host: 'localhost:5000'
};

const outputFile = './swagger-output.json';
const routes = ['./src/routes/user.routes.js','./src/routes/admin.routes.js',];

swaggerAutogen(outputFile, routes, doc);