/* global define */
define(['Backbone', 'models/Topic', 'SemaphoreGetter'], function (Backbone, Topic, SemaphoreGetter) {
  'use strict';
  var Topics = Backbone.Collection.extend({
    model: Topic,
    constructor: function () {
      var self = this;
      this.semaphoreGetter = new SemaphoreGetter({
        url: '/topic/get/',
        successCallback: function (data) {
          self.add(data);
        }
      });
      Backbone.Collection.apply(this, arguments);
    },

    comparator: function (topic) {
      return topic.get('pureName').toLocaleLowerCase();
    },

    getDeferred: function (topicId) {
      var returnValue = this.get(topicId);
      if (!returnValue) {
        return this.semaphoreGetter.addId(topicId);
      }
    }
  });
  return Topics;
});
