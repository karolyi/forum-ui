/* global define */
define(['Backbone', 'BackboneWebapp', 'models/Topic', 'collections/Topics'], function (Backbone, BackboneWebapp, Topic, Topics) {
  'use strict';
  // BackboneWebapp.collections.topics = new Topics();
  var TopicIndex = Backbone.Model.extend({
    initialize: function () {
      this.topicHighlighted = new Topics();
      this.topicNormal = new Topics();
      this.topicArchived = new Topics();
    }
  });
  return TopicIndex;
});
