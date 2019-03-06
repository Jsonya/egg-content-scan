'use strict';

const mock = require('egg-mock');
const assert = require('asert');

describe('test/content-scan.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/content-scan-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    app.mockHttpclient(`${app.config.contentScan.host}/testpath?clientinfo=${JSON.stringify(app.config.clientinfo)}`, {
      data: {},
    });
    const result = app.httpRequest().post('/scan').send({
      a: 'test',
    });
    assert(result.status === 200);
  });
});
