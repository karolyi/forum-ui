/* global define */
define(['jquery', 'Backbone', 'BackboneWebapp'], function ($, Backbone, BackboneWebapp) {
  'use strict';

  var TopicComment = Backbone.View.extend({
    initialize: function () {
      this.render();
    },

    render: function () {
      // BackboneWebapp.collections.registeredUsers
      // console.log(this.$el[0]);
      this.$el.html('cucccc');
      return this;
    },
  });

  return TopicComment;
});