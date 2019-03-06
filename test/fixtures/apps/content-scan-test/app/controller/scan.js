'use strict';

const Controller = require('egg').Controller;

class ScanController extends Controller {
  async scan() {
    this.ctx.body = await this.app.contentScan.scanCurl('/testpath', {
      method: 'post',
      data: this.ctx.request.body,
    });
  }
}

module.exports = ScanController;
