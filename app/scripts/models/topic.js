/* global define */
define(['Backbone'], function (Backbone) {
  'use strict';
  return Backbone.Model.extend({
    idAttribute: 'currCommentUniqId'
  });
});
