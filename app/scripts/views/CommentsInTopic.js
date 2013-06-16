/* global define */
define(['jquery', 'Backbone', 'BackboneWebapp', 'templates'], function ($, Backbone, BackboneWebapp, templates) {
  'use strict';
  var commentsListPageTemplate;
  var commentTemplate;

  var acquireAllLocks = function () {
    BackboneWebapp.collections.topics.semaphoreGetter.acquire();
    BackboneWebapp.collections.registeredUsers.semaphoreGetter.acquire();
  };

  var releaseAllLocks = function () {
    BackboneWebapp.collections.topics.semaphoreGetter.release();
    BackboneWebapp.collections.registeredUsers.semaphoreGetter.release();
  };

  var TopicIndex = Backbone.View.extend({
    initialize: function () {
      var self = this;
      this.viewInstances = {};
      this.$el.addClass('comments-page-tab');
      this._parseArguments(this.options.arguments);
      $.when(
        commentsListPageTemplate || templates.get('commentsListPage.html'),
        commentTemplate || templates.get('commentTemplate.html'),
        BackboneWebapp.collections.topics.getDeferred({slug: this.runParameters.slug})
      ).then(function (commentsListPage, commentTemplateFromLoader) {
        var topicModel = BackboneWebapp.collections.topics.findWhere({slug: self.runParameters.slug});
        self.collection = BackboneWebapp.topicCollections[self.runParameters.slug] || (BackboneWebapp.topicCollections[self.runParameters.slug] = new BackboneWebapp.collections.TopicComments([], {topicModel: topicModel}));
        self.listenTo(self.collection, 'remove', self._onEventRemove);
        self.listenTo(self.collection, 'reset', self._onEventReset);
        self._initTabLabel(topicModel);
        commentsListPageTemplate = commentsListPage;
        commentTemplate = commentTemplateFromLoader;
        self.$el.append(commentsListPageTemplate);
        self.$commentsWrapper = self.$('.comment-list-wrapper');
        self.$controlsWrapper = self.$('.controls-wrapper');
        self.render();
      });
    },

    _onEventRemove: function (model, collection, options) {
      // body...
    },

    _onEventReset: function (collection, options) {
      for (var index = 0; index < options.previousModels.length; index++) {
        var model = options.previousModels[index];
        if (this.viewInstances[model.id]) {
          this.viewInstances[model.id].remove();
          delete this.viewInstances[model.id];
        }
      }
    },

    _parseArguments: function (runParameters) {
      this.$el.attr('data-arguments', runParameters.join('/'));
      this.runParameters = {
        slug: runParameters[0],
        action1: runParameters[1],
        parameter1: runParameters[2]
      };
    },

    _initTabLabel: function (topicModel) {
      var self = this;
      this.navTabView = new BackboneWebapp.views.TopicName({
        el: this.options.navTab,
        model: topicModel,
        showTooltip: true,
        contentProperty: 'pureName',
        setHref: false,
        tooltipPlacement: 'bottom',
        tooltipContentProperty: 'htmlName',
        onClick: function (event, model) {
          var myUrl = '/topic/' + self.runParameters.slug + '/' + self.$el.attr('data-arguments') + '/';
          model.get('id');
          BackboneWebapp.router.navigate(myUrl, {trigger: false});
        }
      });
    },

    render: function (parametersArray) {
      var self = this;
      var deferObj;
      var renderSuccessCallback;
      if (parametersArray) {
        this._parseArguments(parametersArray);
      }
      if (this.runParameters.action1 === 'comment') {
        var commentUniqId = this.runParameters.parameter1;
        if (this.scrollToUniqId(commentUniqId)) {
          return;
        } else {
          deferObj = this.collection.getDeferredFromComment(commentUniqId);
          renderSuccessCallback = function () {
            self.scrollToUniqId(commentUniqId);
          };
        }
      } else if (this.runParameters.action1 === 'page') {
        deferObj = this.collection.getDeferredPage(this.runParameters.parameter1);
      }
      if (deferObj) {
        acquireAllLocks();
        $.when(deferObj).then(function () {
          self._renderComments(renderSuccessCallback);
          releaseAllLocks();
        });
      }
      return this;
    },

    _renderComments: function (renderSuccessCallback) {
      for (var index = 0; index < this.collection.models.length; index++) {
        var model = this.collection.models[index];
        var $commentTemplate = $(commentTemplate);
        this.$commentsWrapper.append($commentTemplate);
        this.viewInstances[model.get('commentUniqId')] = new BackboneWebapp.views.TopicComment({
          el: $commentTemplate,
          model: model,
          controllerView: this
        });
      }
      if ($.isFunction(renderSuccessCallback)) {
        renderSuccessCallback();
      }
    },

    scrollToUniqId: function (commentUniqId) {
      var commentWrapper = this.$commentsWrapper.children('#' + commentUniqId);
      if (commentWrapper.length === 0) {
        return false;
      }
      if (commentWrapper.is(':visible')) {
        var top = commentWrapper.position().top;
        $('html, body').animate({ scrollTop: top }, 100);
      }
      return true;
      // BackboneWebapp.router.navigate('/top', {trigger: false});
    }
  });

  return TopicIndex;
});
