/* global define */
define(['jquery', 'Backbone', 'BackboneWebapp', 'i18n'], function ($, Backbone, BackboneWebapp, i18n) {
  'use strict';
  var navTabs = $('#forum-main-navtabs');
  var tabContentWrapper = $('#forum-main-tabcontent-wrapper');
  var startupTime = true;

  var randomString = function () {
    return Math.random().toString(36).substring(2);
  };

  var acquireAllLocks = function () {
    BackboneWebapp.collections.topics.semaphoreGetter.acquire();
    BackboneWebapp.collections.registeredUsers.semaphoreGetter.acquire();
  };

  var releaseAllLocks = function () {
    BackboneWebapp.collections.topics.semaphoreGetter.release();
    BackboneWebapp.collections.registeredUsers.semaphoreGetter.release();
  };

  var Router = Backbone.Router.extend({
    routes: {
      'topic/': 'topicIndex',
      'topic/:slug/:action1/:parameter1/': 'topicComments'
    },

    topicIndex: function () {
      var indexTab = navTabs.find('a[data-appname="topic"]');
      if (indexTab.length === 0) {
        var myRandom = randomString();
        indexTab = $('<a/>', {
          href: '#' + myRandom,
          'data-toggle': 'tab',
          'data-appname': 'topic',
          text: i18n.gettext('Topic list')
        });
        if (startupTime) {
          navTabs.prepend($('<li/>').append(indexTab));
        } else {
          navTabs.append($('<li/>').append(indexTab));
        }
        var contentWrapper = $('<div>', {
          'class': 'tab-pane',
          id: myRandom
        });
        tabContentWrapper.append(contentWrapper);
        require(['views/TopicIndex'], function (TopicIndex) {
          var topicIndex = new TopicIndex({
            navTab: indexTab,
            el: contentWrapper
          });
          contentWrapper.data('widgetInstance', topicIndex);
        });
      }
      indexTab.tab('show');
    },

    topicComments: function () {
      var runParameters = Array.prototype.slice.call(arguments, 0);
      var slug = runParameters[0];
      var contentWrapper;
      var indexTab = navTabs.find('a[data-appname="topic/' + slug + '"]');
      if (indexTab.length === 0) {
        var myRandom = randomString();
        indexTab = $('<a/>', {
          href: '#' + myRandom,
          'data-toggle': 'tab',
          'data-appname': 'topic/' + slug
        });
        if (startupTime) {
          navTabs.prepend($('<li/>').append(indexTab));
        } else {
          navTabs.append($('<li/>').append(indexTab));
        }
        contentWrapper = $('<div>', {
          'class': 'tab-pane',
          id: myRandom
        });
        tabContentWrapper.append(contentWrapper);
        acquireAllLocks();
        require(['views/CommentsInTopic'], function (CommentsInTopic) {
          var commentsInTopic = new CommentsInTopic({
            navTab: indexTab,
            el: contentWrapper,
            arguments: runParameters
          });
          contentWrapper.data('widgetInstance', commentsInTopic);
          releaseAllLocks();
        });
        indexTab.tab('show');
      } else {
        contentWrapper = tabContentWrapper.children(indexTab.attr('href'));
        indexTab.tab('show');
        if (contentWrapper.data('widgetInstance')) {
          contentWrapper.data('widgetInstance').render(runParameters);
        }
      }
    }
  });

  var init = function () {
    acquireAllLocks();
    Backbone.history.start({
      pushState: true
    });
    var origPathname = document.location.pathname;
    if (BackboneWebapp.configuration.guiState.tabList !== undefined) {
      $.each(BackboneWebapp.configuration.guiState.tabList, function (index, element) {
        BackboneWebapp.router.navigate(element, {
          trigger: true,
          replace: true
        });
      });
      if (document.location.pathname !== origPathname) {
        if (origPathname === '/') {
          origPathname = '/topic/';
        }
        BackboneWebapp.router.navigate(origPathname, {
          trigger: true
        });
      }
    } else {
      BackboneWebapp.router.navigate('/index', {trigger: true});
    }
    startupTime = false;
    releaseAllLocks();
  };

  BackboneWebapp.router = new Router();

  return {
    init: init
  };
});
