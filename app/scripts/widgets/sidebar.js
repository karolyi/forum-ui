/*global define */
define(['jquery', 'BackboneWebapp'], function ($, BackboneWebapp) {
  'use strict';
  var sidebarSetup = {
    init: function () {
      $('.sidebar-nav-wrapper').focusin(function () {
        $(this).addClass('focused');
      }).focusout(function () {
        $(this).removeClass('focused');
      });
      this._initLanguages();
    },

    _initLanguages: function () {
      var dropdownMenu = $('.sidebar-nav-wrapper .language-menu .dropdown-menu');
      var menuClickCallback = function (event) {
        event.preventDefault();
        console.log($(this).attr('data-langid'));
        $(this).blur();
      };
      for (var key in BackboneWebapp.configuration.languageObj) {
        var menuLink = $('<a>', {
          href: '#',
          click: menuClickCallback,
          'data-langid': key,
        }).text(BackboneWebapp.configuration.languageObj[key]);
        dropdownMenu.append($('<li>').append(menuLink));
      }
    }
  };
  return sidebarSetup;
});
