/* global define */
define(['backbone', 'backboneWebapp', 'models/topicType'], function (backbone, backboneWebapp, topicType) {
  'use strict';
  return backbone.Collection.extend({
    model: topicType
  });
});
