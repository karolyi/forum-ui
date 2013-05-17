/* global define */
define(['jquery'], function ($) {
  'use strict';
  var apiHost = 'https://api.hondaforum.hu';

  var returnObject = {
    onReady: function (callback) {
      $.ajax({
        url: apiHost + '/settings/defaults',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          callback(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log('CONFIG LOAD ERROR:', errorThrown);
        }
      });
    }
  };

  return returnObject;
});
