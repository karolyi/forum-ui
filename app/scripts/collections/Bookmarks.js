/* global define */
define(['Backbone', 'BackboneWebapp', 'models/Bookmark'], function (Backbone, BackboneWebapp, Bookmark) {
  'use strict';
  return Backbone.Collection.extend({
    model: Bookmark
  });
});
