/*global define */
define(['jquery', 'widgets/backgroundChanger', 'i18n', 'BackboneWebapp', 'widgets/sidebar', 'socketio', 'router', 'dateTime'], function ($, backgroundChanger, i18n, BackboneWebapp, sidebar, socketio, router, dateTime) {
  'use strict';

  var createUi = function () {
    console.debug('createUi');
    sidebar.init();
    router.init();
  };

  var launch = function (config) {
    BackboneWebapp.configuration = config;
    // backgroundChanger.start({
    //   bgImageArray: config.bgImageArray,
    //   changeTime: 5 * 60 * 1000
    // });
    // Load localization and templates for the skin
    $.when(
      i18n.init(config.displayLanguage),
      socketio.init(),
      BackboneWebapp.init()
    ).then(function () {
      // Start the ui
      dateTime.init();
      createUi();
    });
  };

  return {
    launch: launch
  };
});
