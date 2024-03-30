import {CheckJwtGuard} from './check-jwt.guard';
import {Repository} from 'typeorm';
import {User} from '../../shared/models/entities/user';
import {Test, TestingModule} from '@nestjs/testing';

describe('CheckJwtGuard', (): void => {
  let guard: CheckJwtGuard;
  let userRepository: Repository<User>;
  
  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckJwtGuard,
        {
          provide: Repository,
          useClass: User,
        },
      ],
    }).compile();
    
    guard = module.get<CheckJwtGuard>(CheckJwtGuard);
    userRepository = module.get<Repository<User>>(Repository);
  });
  
  it('should be defined', (): void => {
    expect(guard).toBeDefined();
  });
});
