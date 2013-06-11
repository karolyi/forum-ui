/* global define */
define(['jquery', 'Backbone', 'BackboneWebapp', 'views/TopicGroup', 'templates'], function ($, Backbone, BackboneWebapp, TopicGroup, templates) {
  'use strict';
  var topicListTabContent;

  var TopicIndex = Backbone.View.extend({
    loadTopicList: function () {
      var deferObj = $.Deferred();
      this.url = '/topic/';
      $.ajax({
        url: BackboneWebapp.configuration.apiHost + '/topic/index',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          BackboneWebapp.configuration.topicTypes = data.types;
          // bookmarks = data.bookmarks;
          // limit = data.limit;
          deferObj.resolve(data.topics);
        }
      });
      return deferObj.promise();
    },

    initialize: function () {
      var self = this;
      $(this.options.navTab).click(function (event) {
        BackboneWebapp.router.navigate(self.url, {trigger:false});
        event.preventDefault();
      });
      this.$el.addClass('topic-index-tab');
      $.when(
        topicListTabContent || templates.get('topicListTabContent.html'),
        this.loadTopicList()
      ).then(function (tabContent, topicTypeData) {
        topicListTabContent = tabContent;
        self.$el.append(topicListTabContent);
        var elHighlighted = self.$('.topic-highlighted');
        var elBookmarked = self.$('.topic-bookmarked');
        var elNotBookmarked = self.$('.topic-not-bookmarked');
        var elArchived = self.$('.topic-archived');
        BackboneWebapp.collections.topics.semaphoreGetter.acquire();
        BackboneWebapp.collections.registeredUsers.semaphoreGetter.acquire();
        self.topicHighlighted = new TopicGroup({
          topicType: BackboneWebapp.configuration.topicTypes.topicHighlighted,
          topicTypeData: topicTypeData.topicHighlighted,
          el: elHighlighted
        });
        self.topicBookmarked = new TopicGroup({
          topicType: BackboneWebapp.configuration.topicTypes.topicNormal,
          bookmarked: true,
          topicTypeData: topicTypeData.topicBookmarked,
          el: elBookmarked
        });
        self.topicNotBookmarkedOrNormal = new TopicGroup({
          topicType: BackboneWebapp.configuration.topicTypes.topicNormal,
          bookmarked: false,
          topicTypeData: topicTypeData.topicNotBookmarked || topicTypeData.topicNormal,
          el: elNotBookmarked
        });
        self.topicArchived = new TopicGroup({
          topicType: BackboneWebapp.configuration.topicTypes.topicArchived,
          topicTypeData: topicTypeData.topicArchived,
          el: elArchived
        });
        BackboneWebapp.collections.topics.semaphoreGetter.release();
        BackboneWebapp.collections.registeredUsers.semaphoreGetter.release();
      });
    }
  });

  return TopicIndex;
});
