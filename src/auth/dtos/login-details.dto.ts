import { IsNotEmpty, IsString } from 'class-validator'

class LoginDetailsDto {
  @IsString()
  @IsNotEmpty()
  username: string

  @IsNotEmpty()
  password: string
}

export default LoginDetailsDto
