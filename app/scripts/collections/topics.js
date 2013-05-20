/* global define */
define(['backbone', 'backboneWebapp', 'models/topic'], function (backbone, backboneWebapp, topic) {
  'use strict';
  return backbone.Collection.extend({
    model: topic
  });
});
