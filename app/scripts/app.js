/*global define */
define(['jquery', 'widgets/backgroundChanger', 'i18n', 'BackboneWebapp', 'widgets/sidebar', 'socketio', 'router', 'datetime'], function ($, backgroundChanger, i18n, BackboneWebapp, sidebar, socketio, router, datetime) {
  'use strict';

  var createUi = function () {
    console.debug('createUi');
    sidebar.init();
    router.init();
  };

  var launch = function (config) {
    BackboneWebapp.configuration = config;
    backgroundChanger.start({
      bgImageArray: config.bgImageArray,
      changeTime: 5 * 60 * 1000
    });
    // Load localization and templates for the skin
    $.when(
      i18n.init(config.displayLanguage),
      socketio.init(),
      BackboneWebapp.init()
    ).then(function () {
      // Start the ui
      datetime.init();
      createUi();
    });
  };

  return {
    launch: launch
  };
});
