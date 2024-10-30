import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        version: 'v1.0.0',
        title: 'Swagger Doxo',
        description: 'Implementation of Swagger with TypeScript'
    },
    servers: [
        {
            url: 'http://localhost:3003',
            description: ''
        },
    ],

};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./src/server.ts'];

swaggerAutogen( { openapi: '3.0.0' } )( outputFile, endpointsFiles, doc );