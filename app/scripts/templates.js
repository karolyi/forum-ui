/* global define */
define(['jquery', 'loadFile', 'backboneWebapp'], function ($, loadFile, backboneWebapp) {
  'use strict';

  var templateDefers = {};

  var get = function (templateName) {
    if (templateDefers[templateName] === undefined) {
      templateDefers[templateName] = $.Deferred();
      $.when(loadFile('/skins/' + backboneWebapp.configuration.usedSkin + '/templates/' + templateName))
      .then(function (templateContent) {
        templateDefers[templateName].resolve(templateContent);
      });
    }
    return templateDefers[templateName].promise();
  };

  return {
    get: get
  };
});
