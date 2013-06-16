require.config({
  paths: {
    jquery: '../components/jquery/jquery',
    bootstrap: '../components/sass-bootstrap/bootstrap/js/bootstrap',
    'jquery-ui': '../components/jquery-ui/ui/jquery-ui',
    jed: '../components/jed/jed',
    text: '../components/requirejs-text/text',
    underscore: '../components/underscore-amd/underscore',
    Backbone: '../components/backbone-amd/backbone',
    BackboneRel: '../components/backbone-relational/backbone-relational',
    hbs: '../components/require-handlebars-plugin/hbs',
    jStorage: '../components/jStorage/jstorage',
    qtip2: '../components/qtip2/dist/jquery.qtip',
    'jquery-indexeddb': '../components/jquery-indexeddb/jquery.indexeddb',
    IndexedDbShim: '../components/IndexedDBShim/dist/IndexedDBShim.js'
  },
  shim: {
    // For the time being, we load ui here so the bootstrap overwrites it (tooltip problems)
    // https://github.com/twitter/bootstrap/issues/7385
    bootstrap: {
      deps: ['jquery', 'jquery-ui'],
      exports: 'jQuery'
    },
    Backbone: {
      deps: ['underscore'],
    },
    BackboneRel: {
      deps: ['underscore', 'Backbone']
    },
    'jquery-ui': {
      deps: ['jquery']
    },
    jStorage: {
      deps: ['jquery'],
      exports: 'jQuery.jStorage'
    },
    qtip2: {
      deps: ['jquery']
    },
    'jquery-indexeddb': {
      deps: ['jquery', 'IndexedDbShim']
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
