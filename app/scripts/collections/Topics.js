/* global define */
define(['Backbone', 'models/Topic', 'SemaphoreGetter'], function (Backbone, Topic, SemaphoreGetter) {
  'use strict';
  var Topics = Backbone.Collection.extend({
    model: Topic,
    constructor: function () {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      var self = this;
      this.semaphoreGetter = new SemaphoreGetter({
        url: '/topic/get/',
        successCallback: function (data) {
          self.add(data);
        }
      });
    },

    comparator: function (topic) {
      return topic.get('pureName').toLocaleLowerCase();
    },

    getDeferred: function (options) {
      return this.findWhere(options) || this.semaphoreGetter.addTerm(options);
    }
  });
  return Topics;
});
