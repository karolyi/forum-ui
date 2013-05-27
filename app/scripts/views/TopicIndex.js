/* global define */
define(['jquery', 'Backbone', 'BackboneWebapp', 'views/TopicGroup', 'templates'], function ($, Backbone, BackboneWebapp, TopicGroup, templates) {
  'use strict';
  var topicListTabContent;

  var TopicIndex = Backbone.View.extend({
    initialize: function () {
      var self = this;
      $.when(
        topicListTabContent || templates.get('topicListTabContent.html')
      ).then(function (tabContent) {
        topicListTabContent = tabContent;
        self.$el.append(topicListTabContent);
        var elHighlighted = self.$('.topic-highlighted');
        var elBookmarked = self.$('.topic-bookmarked');
        var elNotBookmarked = self.$('.topic-not-bookmarked');
        var elArchived = self.$('.topic-archived');
        self.topicHighlighted = new TopicGroup({
          topicType: BackboneWebapp.configuration.topicTypes.topicHighlighted,
          topicTypeData: self.options.topicTypeData.topicHighlighted,
          el: elHighlighted
        });
        self.topicBookmarked = new TopicGroup({
          topicType: BackboneWebapp.configuration.topicTypes.topicNormal,
          bookmarked: true,
          topicTypeData: self.options.topicTypeData.topicBookmarked,
          el: elBookmarked
        });
        self.topicNotBookmarkedOrNormal = new TopicGroup({
          topicType: BackboneWebapp.configuration.topicTypes.topicNormal,
          bookmarked: false,
          topicTypeData: self.options.topicTypeData.topicNotBookmarked || self.options.topicTypeData.topicNormal,
          el: elNotBookmarked
        });
        self.topicArchived = new TopicGroup({
          topicType: BackboneWebapp.configuration.topicTypes.topicArchived,
          topicTypeData: self.options.topicTypeData.topicArchived,
          el: elArchived
        });
      });
    }
  });

  return TopicIndex;
});