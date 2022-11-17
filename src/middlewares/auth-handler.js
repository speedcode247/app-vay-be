import { verifyToken } from '../utils/jwt';
import config from '../app.config';
import * as userService from '../modules/users/services';
import User from '../collections/user';
export default function (accepted = [...config.app.role]) {
  return async function (req, res, next) {
    const bearer_token = req.headers.authorization;
    if (bearer_token && bearer_token.startsWith('Bearer ')) {
      try {
        const token = bearer_token.split(' ')[1];
        const decoded = await verifyToken(token, config.secret_key);
        req.user = decoded._id;
        req.role = decoded.role;
        if (!accepted.includes(decoded.role)) {
          return res.status(403).json({
            message: 'Bạn không có quyền này.',
          });
        }

        next();
      } catch (error) {
        return res.status(401).json({ message: 'Phiên đăng nhập hết hạn' });
      }
    } else {
      return res.status(401).json({ message: 'Phiên đăng nhập hết hạn' });
    }
  };
}
