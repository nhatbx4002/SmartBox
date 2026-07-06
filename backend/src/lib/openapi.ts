import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SmartBox API',
      version: '1.0.0',
      description: 'Self-service smart locker kiosk system API',
    },
    servers: [{ url: 'http://localhost:3001', description: 'Development' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: { error: { type: 'object', properties: { code: { type: 'string' }, message: { type: 'string' } } } },
        },
        OkResponse: {
          type: 'object',
          properties: { data: { type: 'object', properties: { ok: { type: 'boolean' } } } },
        },
      },
    },
    paths: {
      '/api/health': {
        get: {
          tags: ['System'], summary: 'Health check',
          responses: { '200': { description: 'OK' } },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const openapiSpec = swaggerJsdoc(options);
