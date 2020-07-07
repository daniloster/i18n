import { Server } from 'miragejs'
import en from '../../DEV/assets/locales/en.json'
import es from '../../DEV/assets/locales/es.json'
import ptBR from '../../DEV/assets/locales/pt.json'

const resources = { 'en.json': en, 'pt-BR.json': ptBR, 'es.json': es }

/**
 * Creates a mock api server which mimics the api service behaviour
 * @param {string} environment - the definition of environment for mock api server
 * @return {object}
 */
export default function startMirage(environment = 'development') {
  const server = new Server({
    environment,
    trackRequests: environment === 'test',

    routes() {
      this.namespace = 'assets/locales'
      /**
       * Request Handlers
       * 1st argument
       * @typedef Schema
       * @property {Object} [any model key in the plural]
       * 2nd argument
       * @typedef Request
       * @property {Object} params - params mapped in the URL
       * @property {Object} queryParams - attributes in the query string
       * @property {string} requestBody - the request body sent
       */

      this.get(
        '/:language',
        (schema, request) => {
          const { language } = request.params

          // console.log({ language, resources: !!resources[language] })

          return resources[language]
        },
        { timing: 1000 },
      )
    },
  })

  return server
}
