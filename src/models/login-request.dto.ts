import {Model, model, property} from '@loopback/repository';

@model()
export class LoginRequest extends Model {
  @property({
    type: 'string',
    description:
      'This property is supposed to be a string and is a required field',
    required: true,
  })
  username: string;

  constructor(data?: Partial<LoginRequest>) {
    super(data);
  }
}
