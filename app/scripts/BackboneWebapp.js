/* global define */
define(['jquery'], function ($) {
  'use strict';
  var webapp = {
    init: function () {
      var deferObj = $.Deferred();
      var self = this;
      require([
        'models/RegisteredUser',
        'models/Topic',
        'models/Bookmark',
        'models/Comment',
        'collections/RegisteredUsers',
        'collections/Bookmarks',
        'collections/Topics',
        'collections/Comments',
        'views/TopicName',
        'views/UserName',
        'views/CommentsInTopic',
        'views/TopicComment'
      ], function (
        RegisteredUser,
        Topic,
        Bookmark,
        Comment,
        RegisteredUsers,
        Bookmarks,
        Topics,
        Comments,
        TopicName,
        UserName,
        CommentsInTopic,
        TopicComment
      ) {
        self.models.RegisteredUser = RegisteredUser;
        self.models.Topic = Topic;
        self.models.Bookmark = Bookmark;
        self.models.Comment = Comment;
        self.collections.registeredUsers = new RegisteredUsers();
        self.collections.Bookmarks = Bookmarks;
        self.collections.topics = new Topics();
        self.collections.Comments = Comments;
        self.views.TopicName = TopicName;
        self.views.UserName = UserName;
        self.views.CommentsInTopic = CommentsInTopic;
        self.views.TopicComment = TopicComment;
        deferObj.resolve();
      });
      return deferObj.promise();
    },
    views: {},
    models: {},
    collections: {},
    configuration: {},
    topicTypes: {},
    router: {},
    topicCollections: {},
    widgetInstancesArray: []
  };

  return webapp;
});
