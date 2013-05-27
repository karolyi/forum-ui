/* global define */
define(['Backbone','models/RegisteredUser'], function (Backbone, RegisteredUser) {
  'use strict';
  return Backbone.Collection.extend({
    model: RegisteredUser
  });
});
