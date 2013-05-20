/* global define */
define(['backbone', 'backboneWebapp', 'models/registeredUser'], function (backbone, backboneWebapp, registeredUser) {
  'use strict';
  return backbone.Collection.extend({
    model: registeredUser
  });
});
