import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: 'RandomWord',
  connector: 'rest',
  crud: 'false',
  options: {
    baseUrl: 'RANDOM_WORD_API_URL',
    headers: {
      'content-type': 'application/json',
    },
  },
  operations: [
    {
      template: {
        method: 'GET',
        url: '',
      },
      functions: {
        findWord: [],
      },
    },
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class RandomWordDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'RandomWord';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.RandomWord', {optional: true})
    dsConfig: object = config,
  ) {
    super({...dsConfig, options: {baseUrl: process.env.RANDOM_WORD_API_URL}});
  }
}
