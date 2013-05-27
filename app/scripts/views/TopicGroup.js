/* global define */
define(['jquery', 'Backbone', 'BackboneWebapp', 'templates', 'i18n', 'datetime'], function ($, Backbone, BackboneWebapp, templates, i18n) {
  'use strict';
  var topicGroupTemplate;
  var loadLaunchTemplate;
  var itemTemplate;

  var TopicIndex = Backbone.View.extend({
    initialize: function () {
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
      });
    },

    _initTemplate: function () {
      this.$el.append(topicGroupTemplate);
      this.$('.paginate-forward').text(i18n.gettext('Forward'));
      this.$('.paginate-backward').text(i18n.gettext('Backward'));
    },

    _initLauncher: function () {
      this.$el.append(loadLaunchTemplate);
      this.$('.button-launch').text(i18n.gettext('Load topic list'));
    },

    _adjustTooltip: function (tooltip) {
      var tip = tooltip.tip();
      var pos = tooltip.getPosition();

      var actualWidth = tip[0].offsetWidth;
      var actualHeight = tip[0].offsetHeight;
      var tp;

      switch (tooltip.options.placement) {
      case 'bottom':
        tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2};
        break;
      case 'top':
        tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2};
        break;
      case 'left':
        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth};
        break;
      case 'right':
        tp = {top: pos.top + (pos.height / 2) - (actualHeight / 2), left: pos.left + pos.width};
        break;
      }
      tooltip.applyPlacement(tp, tooltip.options.placement);
    },

    _drawTopicList: function (parentElement) {
      var self = this;
      $.each(this.options.topicTypeData, function (index, element) {
        var template = $(itemTemplate);
        template.find('.topic-name').html(element.htmlName).tooltip({
          title: function () {
            var myDiv = this;
            setTimeout(function () {
              self._adjustTooltip($(myDiv).data('tooltip'));
            }, 50);
            return element.currParsedCommentText;
          },
          html: true,
          placement: 'right'
        });
        template.find('.comment-count').text(element.commentCount);
        template.find('.last-comment-date').dateTime({
          time: element.currCommentTime
        });
        parentElement.append(template);
        // $.when()
      });
    },

    _continueInit: function () {
      var topicTypes = BackboneWebapp.configuration.topicTypes;
      if (this.options.topicTypeData) {
        BackboneWebapp.collections.topics.add(this.options.topicTypeData);
      }
      // When bookmarked topics, and either non-separated showup or no bookmarked topics
      if (this.options.topicType === topicTypes.topicNormal && this.options.bookmarked && (!BackboneWebapp.configuration.sessionSettings.bookmarkedTopicsFirst || this.options.topicTypeData === undefined)) {
        return;
      }
      if (this.options.topicType === topicTypes.topicArchived && !BackboneWebapp.configuration.userSettings.showArchivedTopics) {
        this._initLauncher();
        return;
      }
      this._initTemplate();
      this._drawTopicList(this.$('.list-wrapper'));
    }
  });
  return TopicIndex;
});
