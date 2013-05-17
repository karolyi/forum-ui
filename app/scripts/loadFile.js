/*global define */
define(['jquery'], function ($) {
  'use strict';
  /**
   * Load a file from any given url
   * @param  {string} url      the url to load
   * @param  {string} dataType the dataType to enforce (@see jQuery.ajax dataType)
   * @return {object}          a deferred object, resolves with the file when ready, or rejects with the error message when fails
   */
  var loadFile = function (url, dataType) {
    var deferObj = $.Deferred();
    var success = function (data) {
      deferObj.resolve(data);
    };
    var error = function (jqXHR, textStatus, errorThrown) {
      console.log('loadFile.js: error loading', url, ':', errorThrown);
      deferObj.reject(errorThrown);
    };
    if (dataType) {
      $.ajax({
        url: url,
        dataType: dataType,
        success: success,
        error: error
      });
    } else {
      $.ajax({
        url: url,
        success: success,
        error: error
      });
    }
    return deferObj.promise();
  };

  return loadFile;
});
