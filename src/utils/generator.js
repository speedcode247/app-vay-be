import otpGenerator from 'otp-generator';

export const createOTP = () => {
  return otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false,
    digits: true,
    alphabets: false,
  });
};

export const createContracNumber = () => {
  return otpGenerator.generate(8, {
    upperCase: false,
    specialChars: false,
    digits: true,
    alphabets: false,
  });
};

export const createPassword = () => {
  return otpGenerator.generate(10, {
    upperCase: false,
    specialChars: false,
    digits: true,
    alphabets: true,
  });
};
