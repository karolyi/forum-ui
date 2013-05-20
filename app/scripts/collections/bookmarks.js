/* global define */
define(['backbone', 'backboneWebapp', 'models/bookmark'], function (backbone, backboneWebapp, bookmark) {
  'use strict';
  return backbone.Collection.extend({
    model: bookmark
  });
});
