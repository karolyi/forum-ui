/* global define */
define(['jquery', 'backboneWebapp'], function ($, backboneWebapp) {
  'use strict';
  var confGuiState;
  var tabs = {};

  var openTab = function (tabName) {
    console.debug('opening', tabName);
    if (tabName.indexOf('/index') === 0) {
      require(['widgets/topicList'], function (topicList) {
        topicList.init();
      });
    }
  };

  var init = function () {
    confGuiState = backboneWebapp.configuration.guiState;
    $.each(confGuiState.tabList, function (index, element) {
      openTab(element);
    });
  };

  return {
    init:init
  };
});
