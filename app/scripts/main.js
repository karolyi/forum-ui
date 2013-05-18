require.config({
  paths: {
    jquery: '../components/jquery/jquery',
    bootstrap: 'vendor/bootstrap',
    'jquery-ui': '../components/jquery-ui/ui/jquery-ui',
    jed: '../components/jed/jed',
    text: '../components/requirejs-text/text',
    underscore: '../components/underscore-amd/underscore',
    backbone: '../components/backbone-amd/backbone',
    hbs: '../components/require-handlebars-plugin/hbs',
    jStorage: '../components/jStorage/jstorage'
  },
  shim: {
    bootstrap: {
      deps: ['jquery'],
      exports: 'jQuery'
    },
    'jquery-ui': {
      deps: ['jquery']
    },
    jStorage: {
      deps: ['jquery'],
      exports: 'jQuery.jStorage'
    }
  }
});

require(['configLoader', 'jquery', 'app', 'bootstrap'], function (configLoader, $, app) {
  'use strict';
  var configDeferObj = $.Deferred();
  var domReadyDeferObj = $.Deferred();

  configLoader.onReady(function (config) {
    configDeferObj.resolve(config);
  });
  $(document).ready(function () {
    domReadyDeferObj.resolve();
  });
  // Load only when the config and the DOM is loaded
  $.when(
    configDeferObj.promise(),
    domReadyDeferObj.promise()
  ).then(function (config) {
    app.launch(config);
  });
});
