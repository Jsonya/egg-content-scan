'use strict';

const CONTENTSCAN = Symbol('Application#CONTENTSCAN');

module.exports = {
  get contentScan() {
    if (!this[CONTENTSCAN]) {
      const Scan = require('../../lib/scan')(this);
      this[CONTENTSCAN] = new Scan();
    }

    return this[CONTENTSCAN];
  },
};
