import CryptoJS from 'crypto-js';

const keySize = 192;
const iterations = 12122;

const encrypt = (data) => {
  const salt = CryptoJS.lib.WordArray.random(256 / 8);
  const iv = CryptoJS.lib.WordArray.random(128 / 8);

  const key = CryptoJS.PBKDF2(process.env.ENC_KEY, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  const encrypted = CryptoJS.TripleDES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
    iv: iv,
  });

  return salt.toString() + iv.toString() + encrypted.toString();
};

const decrypt = (data) => {
  const salt = CryptoJS.enc.Hex.parse(data.substr(0, 64));
  const iv = CryptoJS.enc.Hex.parse(data.substr(64, 32));
  const encrypted = data.substring(96);

  const key = CryptoJS.PBKDF2(process.env.ENC_KEY, salt, {
    keySize: keySize / 32,
    iterations: iterations,
  });

  try {
    const decrypted = CryptoJS.TripleDES.decrypt(encrypted, key, {
      iv: iv,
    });

    if (decrypted.toString() === '') {
      return false;
    }

    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    return false;
  }
};

const EncryptionService = {
  encrypt,
  decrypt,
};

export default EncryptionService;
