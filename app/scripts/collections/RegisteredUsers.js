/* global define */
define(['Backbone','models/RegisteredUser', 'SemaphoreGetter'], function (Backbone, RegisteredUser, SemaphoreGetter) {
  'use strict';
  return Backbone.Collection.extend({
    model: RegisteredUser,
    constructor: function () {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      var self = this;
      this.semaphoreGetter = new SemaphoreGetter({
        url: '/user/get/',
        successCallback: function (data) {
          self.add(data);
        }
      });
    },

    comparator: function (user) {
      return user.get('name').toLocaleLowerCase();
    },

    getDeferred: function (options) {
      var returnValue = this.findWhere(options);
      if (returnValue === undefined) {
        return this.semaphoreGetter.addTerm(options);
      }
    }
  });
});
