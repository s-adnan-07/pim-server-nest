import { Reflector } from '@nestjs/core'
import { JwtGuard } from './jwt.guard'

describe('JwtGuard', () => {
  let reflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as Reflector

  it('should be defined', () => {
    expect(new JwtGuard(reflector)).toBeDefined()
  })
})
