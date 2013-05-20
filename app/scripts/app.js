/*global define */
define(['jquery', 'widgets/backgroundChanger', 'i18n', 'backboneWebapp', 'widgets/sidebar', 'socketio', 'router'], function ($, backgroundChanger, i18n, backboneWebapp, sidebar, socketio, router) {
  'use strict';

  var createUi = function () {
    console.debug('createUi');
    sidebar.init();
    router.init();
  };

  var launch = function (config) {
    backboneWebapp.configuration = config;
    backgroundChanger.start({
      bgImageArray: config.bgImageArray,
      changeTime: 5 * 60 * 1000
    });
    // Load localization and templates for the skin
    $.when(
      i18n.init(config.displayLanguage),
      socketio.init(),
      backboneWebapp.init()
    ).then(function () {
      // Start the ui
      createUi();
    });
  };

  return {
    launch: launch
  };
});
