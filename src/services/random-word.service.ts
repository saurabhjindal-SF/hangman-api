import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {RandomWordDataSource} from '../datasources';

export interface RandomWord {
  findWord(): Promise<Object>;
}

export class RandomWordProvider implements Provider<RandomWord> {
  constructor(
    @inject('datasources.RandomWord')
    protected dataSource: RandomWordDataSource,
  ) {}

  value(): Promise<RandomWord> {
    return getService(this.dataSource);
  }
}
