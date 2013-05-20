/* global define */
define(['jquery', 'backbone', 'backboneWebapp', 'i18n', 'widgets/tabs'], function ($, backbone, backboneWebapp, i18n, tabs) {
  'use strict';
  var confGuiState;
  var navTabs = $('#forum-main-navtabs');
  var tabContentWrapper = $('#forum-main-tabcontent-wrapper');

  var randomString = function () {
    return Math.random().toString(36).substring(2);
  };

  var Router = backbone.Router.extend({
    routes: {
      'index': 'index'
    },

    index: function () {
      var indexTab = navTabs.find('[data-url="/index"]');
      if (indexTab.length === 0) {
        var myRandom = randomString();
        indexTab = $('<a/>', {
          href: '#' + myRandom,
          'data-toggle': 'tab',
          text: i18n.gettext('Topic list')
        });
        navTabs.append($('<li/>').append(indexTab));
        var contentWrapper = $('<div>', {
          'class': 'tab-pane',
          id: myRandom
        });
        tabContentWrapper.append(contentWrapper);
        require(['widgets/topicList'], function (topicList) {
          topicList.init({
            navTab: indexTab,
            contentWrapper: contentWrapper
          });
        });
      }
      indexTab.click();
      console.debug('itt');
    }
  });

  var init = function () {
    confGuiState = backboneWebapp.configuration;
    backbone.history.start({pushState: true});
    var origPath = document.location.path;
    if (confGuiState.tabList !== undefined) {
      $.each(confGuiState.tabList, function (index, element) {
        routerInstance.navigate(element, {
          trigger: true
        });
      });
      if (document.location.path !== origPath) {
        routerInstance.navigate(origPath, {
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