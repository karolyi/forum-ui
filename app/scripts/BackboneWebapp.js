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
        'collections/Topics',
        'views/TopicName',
        'views/UserName'
      ], function (
        RegisteredUser,
        RegisteredUsers,
        Topic,
        Bookmark,
        Bookmarks,
        Topics,
        TopicName,
        UserName
      ) {
        self.models.RegisteredUser = RegisteredUser;
        self.collections.registeredUsers = new RegisteredUsers();
        self.models.Topic = Topic;
        self.models.Bookmark = Bookmark;
        self.collections.Bookmarks = Bookmarks;
        self.collections.topics = new Topics();
        self.views.TopicName = TopicName;
        self.views.UserName = UserName;
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
