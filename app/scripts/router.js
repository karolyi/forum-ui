/* global define */
define(['jquery', 'Backbone', 'BackboneWebapp', 'i18n'], function ($, Backbone, BackboneWebapp, i18n) {
  'use strict';
  var navTabs = $('#forum-main-navtabs');
  var tabContentWrapper = $('#forum-main-tabcontent-wrapper');

  var randomString = function () {
    return Math.random().toString(36).substring(2);
  };

  var Router = Backbone.Router.extend({
    routes: {
      'index': 'index'
    },

    index: function () {
      var indexTab = navTabs.find('[data-appname="/index"]');
      if (indexTab.length === 0) {
        var myRandom = randomString();
        indexTab = $('<a/>', {
          href: '#' + myRandom,
          'data-toggle': 'tab',
          'data-appname': '/index',
          text: i18n.gettext('Topic list')
        });
        navTabs.append($('<li/>').append(indexTab));
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
      indexTab.click();
    }
  });

  var init = function () {
    Backbone.history.start({
      pushState: true
    });
    var origPathname = document.location.pathname;
    if (BackboneWebapp.configuration.guiState.tabList !== undefined) {
      $.each(BackboneWebapp.configuration.guiState.tabList, function (index, element) {
        routerInstance.navigate(element, {
          trigger: true
        });
      });
      if (document.location.pathname !== origPathname) {
        routerInstance.navigate(origPathname, {
          trigger: true
        });
      }
    } else {
      routerInstance.navigate('/index');
    }
  };

  var routerInstance = new Router();
  // console.log(routerInstance);

  return {
    init: init
  };
});
