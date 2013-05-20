/* global define */
define(['jquery', 'backboneWebapp'], function ($, backboneWebapp) {
  'use strict';
  var navTab, contentWrapper;
  var topicTypeCollection = new backboneWebapp.collections.topicTypes({});

  var init = function (options) {
    navTab = options.navTab;
    contentWrapper = options.contentWrapper;
    contentWrapper.text('stuff');
  };

  return {
    init: init
  };
});