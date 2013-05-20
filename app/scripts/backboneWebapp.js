/* global define */
define(['jquery', 'backbone'], function ($, backbone) {
  'use strict';
  var webapp = {
    init: function () {
      var deferObj = $.Deferred();
      var self = this;
      require([
        'models/registeredUser',
        'collections/registeredUsers',
        'models/topic',
        'collections/topics',
        'models/bookmark',
        'collections/bookmarks',
        'models/topicType',
        'collections/topicTypes'
      ], function (
        registeredUser,
        registeredUsers,
        topic,
        topics,
        bookmark,
        bookmarks,
        topicType,
        topicTypes
      ) {
        self.models.registeredUser = registeredUser;
        self.collections.registeredUsers = registeredUsers;
        self.models.topic = topic;
        self.collections.topics = topics;
        self.models.bookmark = bookmark;
        self.collections.bookmarks = bookmarks;
        self.models.topicType = topicType;
        self.collections.topicTypes = topicTypes;
        deferObj.resolve();
      });
      return deferObj.promise();
    },
    views: {},
    models: {},
    collections: {},
    configuration: {}
  };

  return webapp;
});
