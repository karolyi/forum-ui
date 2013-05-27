/* global define */
define(['jquery', 'BackboneWebapp'], function ($, BackboneWebapp) {
  'use strict';
  var confGuiState;

  var openTab = function (tabName) {
    console.debug('opening', tabName);
    if (tabName.indexOf('/index') === 0) {
      require(['widgets/topicList'], function (topicList) {
        topicList.init();
      });
    }
  };

  var init = function () {
    confGuiState = BackboneWebapp.configuration.guiState;
    $.each(confGuiState.tabList, function (index, element) {
      openTab(element);
    });
  };

  return {
    init:init
  };
});
