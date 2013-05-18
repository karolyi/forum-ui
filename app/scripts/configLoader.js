/* global define */
define(['jquery'], function ($) {
  'use strict';
  var apiHost = 'https://api.hondaforum.hu';
  // We set a timeout here for 3s, if the settings is not loaded by then, we redirect to the api
  // because the certificate must have been accepted
  var isSettingsLoaded = false;
  setTimeout(function () {
    if (!isSettingsLoaded) {
      document.location.href = apiHost + '/redirect/web/?ref=' + document.location.href;
    }
  }, 3000);

  var returnObject = {
    onReady: function (callback) {
      $.ajax({
        url: apiHost + '/settings/defaults',
        dataType: 'json',
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          isSettingsLoaded = true;
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
