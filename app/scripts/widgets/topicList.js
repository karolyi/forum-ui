/* global define */
define(['jquery', 'BackboneWebapp', 'views/TopicIndex'], function ($, BackboneWebapp, TopicIndex) {
  'use strict';
  var navTab, contentWrapper;
  var bookmarks = {};
  var limit;
  var topicIndex;

  var init = function (options) {
    navTab = options.navTab;
    contentWrapper = options.contentWrapper;
    loadTopicList();
  };


  var loadTopicList = function () {
    var deferObj = $.Deferred();
    $.ajax({
      url: BackboneWebapp.configuration.apiHost + '/topic/index',
      dataType: 'json',
      xhrFields: {
        withCredentials: true
      },
      success: function (data) {
        var topicTypeData = data.topics;
        BackboneWebapp.configuration.topicTypes = data.types;
        bookmarks = data.bookmarks;
        limit = data.limit;
        topicIndex = new TopicIndex({
          el: contentWrapper,
          topicTypeData: topicTypeData
        });
        deferObj.resolve(data);
      }
    });
    return deferObj.promise();
  };

  return {
    init: init
  };
});
