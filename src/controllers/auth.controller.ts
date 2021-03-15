import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {getModelSchemaRef, post, requestBody} from '@loopback/rest';
import * as jwt from 'jsonwebtoken';
import {ErrorCodes, StatusCode} from '../enums';
import {CodeResponse, LoginRequest} from '../models';
import {UserRepository} from '../repositories';
import {LoggerService} from '../services';

export class AuthController {
  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository,
    @inject('services.LoggerService')
    private readonly logger: LoggerService,
  ) {}

  @post('/login', {
    responses: {
      [StatusCode.OK]: {
        description: 'player login',
        content: {
          'application/json': {schema: getModelSchemaRef(CodeResponse)},
        },
      },
      ...ErrorCodes,
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(LoginRequest),
        },
      },
    })
    loginRequest: LoginRequest,
  ): Promise<CodeResponse> {
    let user;
    try {
      user = await this.userRepository.findById(loginRequest.username);
    } catch (e) {
      this.logger.error(e);
    }

    if (!user) {
      user = await this.userRepository.create(loginRequest);
    }

    const code = jwt.sign(user.username, process.env.JWT_SECRET ?? '');

    return new CodeResponse({
      code,
    });
  }
}
