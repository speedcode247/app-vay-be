import jwt from 'jsonwebtoken';

export const generateToken = (user, secretSignature, tokenLife) => {
  return new Promise((resolve, reject) => {
    const userData = {
      _id: user._id,
      role: user.role,
    };
    jwt.sign(
      { ...userData },
      secretSignature,
      { algorithm: 'HS256', expiresIn: tokenLife },
      (error, token) => {
        if (error) return reject(error);
        resolve(token);
      }
    );
  });
};

export const verifyToken = (token, secretKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) return reject(error);
      resolve(decoded);
    });
  });
};
