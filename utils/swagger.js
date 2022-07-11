export * as swaggerUi from 'swagger-ui-express'
import swaggereJsdoc from 'swagger-jsdoc'

export const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'WFT-API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://125.6.36.157:3001/v1',
      },
    ],
  },
  apis: ['./routes/*.js', './routes/*/*.js', './swagger/*'],
}

export const specs = swaggereJsdoc(options)
