/* global define */
define(['jquery', 'Backbone', 'models/Comment', 'SemaphoreGetter', 'BackboneWebapp', 'underscore'], function ($, Backbone, Comment, SemaphoreGetter, BackboneWebapp, _) {
  'use strict';
  var Comments = Backbone.Collection.extend({
    model: Comment,
    constructor: function () {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      var self = this;
      this.semaphoreGetter = new SemaphoreGetter({
        url: '/comment/get/',
        successCallback: function (data) {
          self.add(data);
        },
        beforeLaunchFilter: function (element) {
          return !self.findWhere(element);
        }
      });
    },

    comparator: function (comment) {
      return -parseInt(comment.get('commentUniqId'), 16); // commentUniqId reverse sort (convert to decimal)
    },

    getDeferred: function (options) {
      return this.findWhere(options) || this.semaphoreGetter.addTerm(options);
    },

    getDeferredPage: function (pageId) {
      var deferObj = $.Deferred();
      var self = this;
      $.ajax({
        url: BackboneWebapp.configuration.apiHost + '/comment/page',
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify({
          topic: {
            slug: this.topicSlug
          },
          page: pageId
        }),
        contentType : 'application/json',
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          if (data.errors.length) {
            console.error(data.errors.join('\n'));
          }
          if (_.size(data.result) > 0) {
            self.numOfPages = data.result.numOfPages;
            if (pageId === 'last') {
              pageId = self.numOfPages;
            }
            $.each(data.result.comments, function (index, element) {
              element.pageId = pageId;
            });
            self.add(data.result.comments);
          }
          deferObj.resolve();
        }
      });
      return deferObj.promise();
    }

  });
  return Comments;
});
