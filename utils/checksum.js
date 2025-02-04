const crypto = require('crypto');

exports.generateChecksum = (data, key) => {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(data) + key)
    .digest('hex');
};
