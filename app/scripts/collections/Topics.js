/* global define */
define(['Backbone', 'models/Topic'], function (Backbone, Topic) {
  'use strict';
  var Topics = Backbone.Collection.extend({
    model: Topic,
    comparator: function (topic) {
      return topic.get('currCommentUniqId');
    }
  });
  return Topics;
});
