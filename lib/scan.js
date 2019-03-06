'use strict';

const assert = require('assert');
const crypto = require('crypto');
const uuidV1 = require('uuid/v1');

module.exports = app => {
  return class Scan {
    constructor() {
      this.config = app.config.contentScan;
      this.app = app;
      assert(this.config.accessKeyId && this.config.accessKeySecret, 'accessKeyId and accessKeySecret must be set in config');
    }

    get defaultHeader() {
      return {
        Accept: 'application/json',
        'content-type': 'application/json',
        Date: new Date().toUTCString(),
        'x-acs-version': this.config.greenVersion,
        'x-acs-signature-nonce': uuidV1(),
        'x-acs-signature-version': '1.0',
        'x-acs-signature-method': 'HMAC-SHA1',
      };
    }

    createMD5(body) {
      return crypto.createHash('md5').update(body).digest('base64');
    }

    createSha1(stringToSign) {
      return crypto.createHmac('sha1', this.config.accessKeySecret)
        .update(stringToSign)
        .digest()
        .toString('base64');
    }

    getOptionsWithSign({
      path,
      method,
      data,
    }) {
      const headers = this.defaultHeader;
      const {
        clientInfo,
        accessKeyId,
      } = this.config;
      const contentMd5 = this.createMD5(JSON.stringify(data));
      const signature = [];
      signature.push(method + '\n');
      signature.push('application/json\n');
      signature.push(contentMd5 + '\n');
      signature.push('application/json\n');
      signature.push(headers.Date + '\n');
      signature.push('x-acs-signature-method:HMAC-SHA1\n');
      signature.push('x-acs-signature-nonce:' + headers['x-acs-signature-nonce'] + '\n');
      signature.push('x-acs-signature-version:1.0\n');
      signature.push('x-acs-version:2017-01-12\n');
      signature.push(path + '?clientInfo=' + JSON.stringify(clientInfo));
      const authorization = this.createSha1(signature.join(''));
      return {
        method,
        data,
        headers: {
          ...headers,
          Authorization: 'acs ' + accessKeyId + ':' + authorization,
          'Content-MD5': contentMd5,
        },
      };
    }

    async scanCurl(path, options) {
      const {
        host,
        clientInfo,
        debug,
        timeout = 10000,
      } = this.config;
      // sign options
      const signOptions = this.getOptionsWithSign({
        path,
        method: options.method,
        data: options.data,
      });
      // final options
      const finalOptions = Object.assign({}, signOptions, {
        timeout,
        dataType: 'json',
      });
      const api = host + path + '?clientInfo=' + JSON.stringify(clientInfo);
      if (debug === true) {
        this.app.logger.info('[egg-content-scan] fullUrl:', api);
        this.app.logger.info('[egg-content-scan] curlOptions:', finalOptions);
      }
      const result = (await this.app.curl(encodeURI(api), finalOptions)).data;
      // catch code
      if (result.code !== 200) {
        return {
          error: {
            code: result.code,
            message: result.msg,
            detail: {
              request_id: result.request_id,
            },
          },
        };
      }
      return {
        data: result.data,
      };
    }
  };
};
