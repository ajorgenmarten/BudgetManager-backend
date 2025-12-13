import SessionEntity from '../entities/session.entity';
import UserEntity from '../entities/user.entity';

declare global {
  namespace Express {
    interface User extends UserEntity {}
    interface Request {
      user?: User;
      session?: SessionEntity;
    }
  }
}

export {};
