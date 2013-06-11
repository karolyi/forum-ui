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
      acquireAllLocks();
      var self = this;
      this.viewInstances = {};
      this.$el.addClass('comments-page-tab');
      this.collection = BackboneWebapp.topicCollections[this.slug] || (BackboneWebapp.topicCollections[this.slug] = new BackboneWebapp.collections.Comments());
      this.collection.topicSlug = this.options.arguments[0];
      this._initTabLabel();
      $.when(
        commentsListPageTemplate || templates.get('commentsListPage.html'),
        commentTemplate || templates.get('commentTemplate.html'),
        this.collection.getDeferredPage('last')
      ).then(function (commentsListPage, commentTemplateFromLoader) {
        commentsListPageTemplate = commentsListPage;
        commentTemplate = commentTemplateFromLoader;
        self.$el.append(commentsListPageTemplate);
        self.$commentsWrapper = self.$('.comment-list-wrapper');
        self.$controlsWrapper = self.$('.controls-wrapper');
        self.render();
      });
    },

    _initTabLabel: function () {
      var self = this;
      $.when(
        BackboneWebapp.collections.topics.getDeferred({slug: this.options.arguments[0]})
      ).then(function () {
        var topicModel = BackboneWebapp.collections.topics.findWhere({slug: self.options.arguments[0]});
        self.navTabView = new BackboneWebapp.views.TopicName({
          el: self.options.navTab,
          model: topicModel,
          showTooltip: true,
          contentProperty: 'pureName',
          setHref: false,
          tooltipPlacement: 'bottom',
          tooltipContentProperty: 'htmlName',
          onClick: function (event, model) {
            var myUrl = '/topic/';
            $.each(self.options.arguments, function (index, item) {
              myUrl += item + '/';
            });
            model.get('id');
            BackboneWebapp.router.navigate(myUrl, {trigger: false});
          }
        });
      });
    },

    render: function () {
      var self = this;
      var pageId = this.options.arguments[2] === 'last' ? this.collection.numOfPages : this.options.arguments[2];
      $.each(this.collection.where({
        pageId: pageId
      }), function (index, item) {
        var $commentTemplate = $(commentTemplate);
        self.$commentsWrapper.append($commentTemplate);
        self.viewInstances[item.get('commentUniqId')] = new BackboneWebapp.views.TopicComment({
          el: $commentTemplate,
          model: item,
          controllerView: self
        });
      });
      releaseAllLocks();
      return this;
    },

    scrollToUniqId: function (commentUniqId) {
      var precederWrapper = this.$commentsWrapper.children('#' + commentUniqId);
      if (precederWrapper.length === 0) {
        return false;
      }
      var top = precederWrapper.position().top;
      $('html, body').animate({ scrollTop: top }, 100);
      BackboneWebapp.router.navigate('/top', {trigger: false});
    }
  });

  return TopicIndex;
});
