import {Model, model, property} from '@loopback/repository';

@model()
export class GuessRequest extends Model {
  @property({
    type: 'string',
    description:
      'This property is supposed to be a string and is a required field',
    required: true,
    jsonSchema: {
      pattern: '^[a-zA-Z]{1}$',
    },
  })
  letter: string;

  constructor(data?: Partial<GuessRequest>) {
    super(data);
  }
}
