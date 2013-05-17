/* global define */
define(['backbone'], function (backbone) {
  'use strict';
  var webapp = {
    init: function () {
      // initialize router, views, data and layouts
    },
    start: function () {
      webapp.init();
      backbone.history.start();
    },
    views: {},
    models: {},
    collections: {},
    routers: {},
    templates: {},
    configuration: {}
  };

  return webapp;
});
