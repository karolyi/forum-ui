/* global define */
define(['jquery', 'loadFile', 'BackboneWebapp'], function ($, loadFile, BackboneWebapp) {
  'use strict';

  var templateDefers = {};

  var get = function (templateName) {
    if (templateDefers[templateName] === undefined) {
      templateDefers[templateName] = $.Deferred();
      $.when(loadFile('/skins/' + BackboneWebapp.configuration.usedSkin + '/templates/' + templateName))
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
