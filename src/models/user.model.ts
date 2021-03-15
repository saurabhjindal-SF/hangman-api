import {Entity, model, property} from '@loopback/repository';
import {IAuthUser} from 'loopback4-authentication';

@model()
export class User extends Entity implements IAuthUser {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  username: string;

  @property({
    type: 'string',
  })
  word: string;

  @property({
    type: 'string',
  })
  originalWord: string;

  @property({
    type: 'number',
  })
  guessesLeft: number;

  @property({
    type: 'string',
  })
  guesses: string;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
