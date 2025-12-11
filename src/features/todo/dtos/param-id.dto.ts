import { IsJWT } from 'class-validator';

export default class ParamIdDto {
  @IsJWT()
  id: string;
}
