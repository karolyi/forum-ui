/* global define */
define(['jquery'], function ($) {
  'use strict';
  var webapp = {
    init: function () {
      var deferObj = $.Deferred();
      var self = this;
      require([
        'models/RegisteredUser',
        'collections/RegisteredUsers',
        'models/Topic',
        'models/Bookmark',
        'collections/Bookmarks',
        'collections/Topics'
      ], function (
        RegisteredUser,
        RegisteredUsers,
        Topic,
        Bookmark,
        Bookmarks,
        Topics
      ) {
        self.models.RegisteredUser = RegisteredUser;
        self.collections.RegisteredUsers = RegisteredUsers;
        self.models.Topic = Topic;
        self.models.Bookmark = Bookmark;
        self.collections.Bookmarks = Bookmarks;
        self.collections.topics = new Topics();
        deferObj.resolve();
      });
      return deferObj.promise();
    },
    views: {},
    models: {},
    collections: {},
    configuration: {},
    topicTypes: {}
  };

  return webapp;
});
