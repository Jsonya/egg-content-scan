'use strict';

module.exports = app => {
  const { router, controller } = app;

  router.post('/scan', controller.scan.scan);
};
