/* global define */
define(['Backbone', 'models/Comment'], function (Backbone, Comment) {
  'use strict';
  var CommentsBase = Backbone.Collection.extend({
    model: Comment,

    comparator: function (comment) {
      return -parseInt(comment.get('commentUniqId'), 16); // commentUniqId reverse sort (convert to decimal)
    },

  });
  return CommentsBase;
});
