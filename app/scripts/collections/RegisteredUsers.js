/* global define */
define(['Backbone','models/RegisteredUser', 'SemaphoreGetter'], function (Backbone, RegisteredUser, SemaphoreGetter) {
  'use strict';
  return Backbone.Collection.extend({
    model: RegisteredUser,
    constructor: function () {
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

    getDeferred: function (userId) {
      var returnValue = this.get(userId);
      if (!returnValue) {
        return this.semaphoreGetter.addId(userId);
      }
    }
  });
});
