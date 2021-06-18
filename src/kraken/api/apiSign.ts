// https://github.com/nothingisdead/npm-kraken-api
import qs from "qs";
import crypto, {BinaryToTextEncoding} from "crypto";

const apiSign = (path, request, secret, nonce) => {
    const message       = qs.stringify(request);
    const secret_buffer = new Buffer(secret, 'base64');
    const hash          = crypto.createHash('sha256');
    const hmac          = crypto.createHmac('sha512', secret_buffer);
    const hash_digest   = hash.update(nonce + message).digest(<BinaryToTextEncoding>'binary');
    const hmac_digest   = hmac.update(path + hash_digest, 'binary').digest('base64');

    return hmac_digest;
};

export default apiSign;