import { Test } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

describe('UsersModule', () => {
  it('should compile', async () => {
    const module = await Test.createTestingModule({
      imports: [UsersModule],
    })
      .overrideProvider(getModelToken(User.name))
      .useValue({})
      .compile();

    expect(module).toBeDefined();
    expect(module.get(UsersService)).toBeDefined();
    expect(module.get(UsersController)).toBeDefined();
  });
});
