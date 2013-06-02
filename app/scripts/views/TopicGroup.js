/* global define */
define(['jquery', 'Backbone', 'BackboneWebapp', 'templates', 'i18n', 'datetime'], function ($, Backbone, BackboneWebapp, templates, i18n) {
  'use strict';
  var topicGroupTemplate;
  var loadLaunchTemplate;
  var itemTemplate;

  var TopicGroup = Backbone.View.extend({
    initialize: function () {
      BackboneWebapp.collections.topics.semaphoreGetter.acquire();
      BackboneWebapp.collections.registeredUsers.semaphoreGetter.acquire();
      this.viewsArray = [];
      if (topicGroupTemplate && loadLaunchTemplate && itemTemplate) {
        this._continueInit();
        BackboneWebapp.collections.topics.semaphoreGetter.release();
        BackboneWebapp.collections.registeredUsers.semaphoreGetter.release();
      }
      var self = this;
      $.when(
        topicGroupTemplate || templates.get('topicGroup.html'),
        loadLaunchTemplate || templates.get('loadLaunch.html'),
        itemTemplate || templates.get('topicListItem.html')
      ).then(function (topicGroup, loadLaunch, topicListItem) {
        topicGroupTemplate = topicGroup;
        loadLaunchTemplate = loadLaunch;
        itemTemplate = topicListItem;
        self._continueInit();
        BackboneWebapp.collections.topics.semaphoreGetter.release();
        BackboneWebapp.collections.registeredUsers.semaphoreGetter.release();
      });
    },

    _initTemplate: function () {
      this.$el.append(topicGroupTemplate);
      this.forwardButton = this.$('.paginate-forward').text(i18n.gettext('Forward'));
      this.backwardButton = this.$('.paginate-backward').text(i18n.gettext('Backward'));
    },

    _initLauncher: function () {
      this.$el.append(loadLaunchTemplate);
      this.launchButton = this.$('.button-launch').text(i18n.gettext('Load topic list'));
    },

    _drawTopicList: function (parentElement) {
      var self = this;
      BackboneWebapp.collections.topics.add(this.options.topicTypeData);
      $.each(this.options.topicTypeData, function (index, element) {
        var model = BackboneWebapp.collections.topics.get(element.id);
        var template = $(itemTemplate);
        var topicElement = template.find('.topic-name');
        var commentCountElement = template.find('.comment-count');
        var lastCommentDateElement = template.find('.last-comment-date');
        var lastCommenterNameElement = template.find('.last-commenter-name');

        self.viewsArray.push(new BackboneWebapp.views.TopicName({
          el: topicElement,
          model: model,
          onClick: function (model) {
            BackboneWebapp.router.navigate('/topic/' + model.get('slug') + '/page/last/', {trigger: true});
          }
        }));
        commentCountElement.text(element.commentCount);
        lastCommentDateElement.dateTime({
          time: element.currCommentTime
        });
        self.viewsArray.push(new BackboneWebapp.views.UserName({
          el: lastCommenterNameElement,
          userId: element.currCommentOwnerId
        }));
        parentElement.append(template);
      });
    },

    _continueInit: function () {
      var topicTypes = BackboneWebapp.configuration.topicTypes;
      if (this.options.topicTypeData && this.options.topicTypeData.length > 0) {
        BackboneWebapp.collections.topics.add(this.options.topicTypeData);
      }
      // When bookmarked topics, and either non-separated showup or no bookmarked topics
      if (this.options.topicType === topicTypes.topicNormal && this.options.bookmarked && (!BackboneWebapp.configuration.sessionSettings.bookmarkedTopicsFirst || this.options.topicTypeData === undefined)) {
        return;
      }
      if (this.options.topicType === topicTypes.topicArchived && !BackboneWebapp.configuration.sessionSettings.showArchivedTopics) {
        this._initLauncher();
        return;
      }
      this._initTemplate();
      this._drawTopicList(this.$('.list-wrapper'));
    },

    remove: function () {
      $.each(this.viewsArray, function (index, element) {
        element.remove();
      });
      Backbone.View.prototype.remove.apply(this, arguments);
    }
  });
  return TopicGroup;
});
