/*global define */
define(['jquery', 'widgets/backgroundChanger', 'i18n', 'templates', 'backboneWebapp', 'widgets/sidebarSetup'], function ($, backgroundChanger, i18n, templates, backboneWebapp, sidebarSetup) {
  'use strict';

  var createUi = function () {
    sidebarSetup.init();
  };

  var launchApp = function (config) {
    backboneWebapp.configuration = config;
    backgroundChanger.start({
      bgImageArray: config.bgImageArray,
      changeTime: 5 * 60 * 1000
    });
    // Load localization and templates for the skin
    $.when(
      i18n.init(config.displayLanguage),
      templates.init()
    ).then(function () {
      // Start the ui
      createUi();
    });
  };

  return {
    launch: launchApp
  };
});