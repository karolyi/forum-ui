/*global define */
define(['jquery', 'widgets/backgroundChanger', 'i18n', 'loadFile', 'backboneWebapp', 'widgets/sidebarSetup'], function ($, backgroundChanger, i18n, loadFile, backboneWebapp, sidebarSetup) {
  'use strict';

  var createUi = function () {
    sidebarSetup.init();
  };

  var launchApp = function (config) {
    backgroundChanger.start({
      bgImageArray: config.bgImageArray,
      changeTime: 5 * 60 * 1000
    });
    // Load localization and templates for the skin
    $.when(
      i18n.init(config.displayLanguage),
      loadFile('/skins/' + config.usedSkin + '/templates/test.html')
    ).then(function (l10n, testHtml) {
      backboneWebapp.configuration = config;
      backboneWebapp.templates.testHtml = testHtml;
      // Start the ui
      createUi();
    });
  };

  return {
    launch: launchApp
  };
});
