import {model, Model, property} from '@loopback/repository';

@model()
export class CodeResponse extends Model {
  @property({
    type: 'string',
    required: true,
  })
  code: string;

  constructor(data?: Partial<CodeResponse>) {
    super(data);
  }
}
