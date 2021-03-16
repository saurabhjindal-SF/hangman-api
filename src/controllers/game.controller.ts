import {inject} from '@loopback/core';
import {Getter, repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors,
  post,
  requestBody,
} from '@loopback/rest';
import {
  authenticate,
  AuthenticationBindings,
  STRATEGY,
} from 'loopback4-authentication';
import {ErrorCodes, StatusCode} from '../enums';
import {maxGuesses, replaceLetter} from '../helpers';
import {GuessRequest, User} from '../models';
import {UserRepository} from '../repositories';
import {RandomWord} from '../services';

export class GameController {
  constructor(
    @repository(UserRepository)
    private readonly userRepository: UserRepository,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    private readonly getCurrentUser: Getter<User>,
    @inject('services.RandomWord')
    private readonly randomWord: RandomWord,
  ) {}

  @authenticate(STRATEGY.BEARER)
  @get('/game', {
    responses: {
      [StatusCode.OK]: {
        description: 'start new game',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {
              exclude: ['username', 'originalWord'],
            }),
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async newGame(): Promise<Partial<User>> {
    const user = await this.getCurrentUser();
    // get random word from api
    const newWord = await this.randomWord.findWord();
    let word = '';
    const guessesLeft = maxGuesses;
    const guesses = '';
    // if we got the word update db
    if (newWord && Array.isArray(newWord)) {
      const originalWord = newWord[0].toLowerCase();
      word = originalWord.replace(/\D/g, '_');
      await this.userRepository.updateById(user.username, {
        word,
        originalWord,
        guessesLeft,
        guesses: '',
      });
    }
    return {word, guessesLeft, guesses};
  }

  @authenticate(STRATEGY.BEARER)
  @get('/game/last', {
    responses: {
      [StatusCode.OK]: {
        description: 'current game data',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {
              exclude: ['username'],
            }),
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async currentGame(): Promise<Partial<User>> {
    const user = await this.getCurrentUser();
    const userData = await this.userRepository.findOne({
      where: {username: user.username},
    });
    // return current game if saved in db else start new game
    if (userData?.originalWord) {
      const response: Partial<User> = {
        word: userData.word,
        guessesLeft: userData.guessesLeft,
        guesses: userData.guesses,
      };

      if (!userData.guessesLeft) {
        response.originalWord = userData.originalWord;
      }

      return response;
    } else {
      return this.newGame();
    }
  }

  @authenticate(STRATEGY.BEARER)
  @post('/guess', {
    responses: {
      [StatusCode.OK]: {
        description: 'guess the word',
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {
              exclude: ['username'],
            }),
          },
        },
      },
      ...ErrorCodes,
    },
  })
  async guess(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(GuessRequest),
        },
      },
    })
    {letter}: GuessRequest,
  ): Promise<Partial<User>> {
    // all letters in the db shall be in same case
    letter = letter.toLowerCase();
    const user = await this.getCurrentUser();
    const userData = (await this.userRepository.findOne({
      where: {username: user.username},
    })) as User;

    let word = userData.word;
    let guessesLeft = userData.guessesLeft;

    // return error if user has exhausted all retries
    if (guessesLeft <= 0) {
      throw new HttpErrors.BadRequest('reties exhausted');
    }

    // return error if user has already guessed this letter
    if (userData.guesses.includes(letter)) {
      throw new HttpErrors.BadRequest('this letter has been guesses already');
    }

    const guesses = userData.guesses ? userData.guesses + `,${letter}` : letter;
    // find and replace all occurences of the letter inside the word
    if (userData?.originalWord.includes(letter)) {
      let pos = 0;
      let i = -1;

      // Search the string
      while (pos !== -1) {
        pos = userData?.originalWord.indexOf(letter, i + 1);
        if (pos !== -1) {
          word = replaceLetter(word, letter, pos);
        }
        i = pos;
      }
    } else {
      guessesLeft -= 1;
    }

    // update db with guess count , new letter received and the formed word
    await this.userRepository.updateById(user.username, {
      guessesLeft,
      word,
      guesses,
    });

    const response: Partial<User> = {
      guesses,
      word,
      guessesLeft,
    };

    // return the actual word if user has lost
    if (!guessesLeft) {
      response.originalWord = userData.originalWord;
    }

    return response;
  }
}
