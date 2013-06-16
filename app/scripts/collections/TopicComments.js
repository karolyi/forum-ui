/* global define */
define(['jquery', 'SemaphoreGetter', 'BackboneWebapp', 'underscore', 'collections/CommentsBase'], function ($, SemaphoreGetter, BackboneWebapp, _, CommentsBase) {
  'use strict';
  var TopicComments = CommentsBase.extend({
    constructor: function (models, options) {
      var self = this;
      this.topicModel = options.topicModel;
      CommentsBase.prototype.constructor.apply(this, arguments);
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

    getDeferred: function (options) {
      return this.findWhere(options) || this.semaphoreGetter.addTerm(options);
    },

    getDeferredFromComment: function (commentUniqId) {
      var self = this;
      var deferObj = $.Deferred();
      $.ajax({
        url: BackboneWebapp.configuration.apiHost + '/comment/' + this.topicModel.get('slug') + '/from-id/' + commentUniqId,
        dataType: 'json',
        type: 'GET',
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          if (data.errors.length) {
            console.error(data.errors.join('\n'));
          }
          self.reset();
          if (_.size(data.result.comments) > 0) {
            self._addToCollections(data.result.comments);
          }
          deferObj.resolve();
        }
      });
      return deferObj.promise();
    },

    _addToCollections: function (commentArray) {
      for (var index = 0; index < commentArray.length; index++) {
        var modelArray = commentArray[index];
        BackboneWebapp.collections.allComments.add(modelArray);
        var model = BackboneWebapp.collections.allComments.get(modelArray.commentUniqId);
        if (!(this.get(modelArray.commentUniqId))) {
          this.add(model);
        }
      }
    },

    getDeferredPage: function (pageId) {
      var deferObj = $.Deferred();
      var self = this;
      $.ajax({
        url: BackboneWebapp.configuration.apiHost + '/comment/' + this.topicModel.get('slug') + '/page/' + pageId,
        dataType: 'json',
        // type: 'POST',
        // data: JSON.stringify({
        //   topic: {
        //     slug: this.topicSlug
        //   },
        //   page: pageId
        // }),
        // contentType : 'application/json',
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          if (data.errors.length) {
            console.error(data.errors.join('\n'));
          }
          self.reset();
          if (_.size(data.result.comments) > 0) {
            self._addToCollections(data.result.comments)
          }
          deferObj.resolve();
        }
      });
      return deferObj.promise();
    }

  });
  return TopicComments;
});

