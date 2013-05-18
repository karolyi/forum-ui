/* global define */
define(['jquery', 'loadFile', 'backboneWebapp'], function ($, loadFile, backboneWebapp) {
  'use strict';

  // Configure the templates to load here
  var templates = [
    'test.html'
  ];

  var loadTemplates = function (templateName) {
    var deferObj = $.Deferred();
    $.when.apply($, $.map(templates, function (templateName) {
      return loadFile('/skins/' + backboneWebapp.configuration.usedSkin + '/templates/' + templateName);
    })).then(function (templateContent) {
      backboneWebapp.templates[templateName] = templateContent;
      deferObj.resolve();
    });
    return deferObj.promise();
  };

  var get = function (templateName) {
    return backboneWebapp.templates[templateName];
  };

  var init = function () {
    var deferObj = $.Deferred();
    $.when(
      loadTemplates()
    ).then(function () {
      deferObj.resolve();
    });
    return deferObj.promise();
  };

  return {
    init: init,
    get: get
  };
});