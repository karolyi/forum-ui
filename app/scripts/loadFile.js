/*global define */
define(['jquery', 'jStorage', 'backboneWebapp'], function ($, jStorage, backboneWebapp) {
  'use strict';
  /**
   * Load a file from any given url, but check if it's already in local cache
   * @param  {string} url      the url to load
   * @param  {string} dataType the dataType to enforce (@see jQuery.ajax dataType)
   * @return {object}          a deferred object, resolves with the file when ready, or rejects with the error message when fails
   */
  var setLocal = function (url, data) {
    if (jStorage.get('cacheKey') !== backboneWebapp.configuration.cacheKey) {
      jStorage.flush();
      jStorage.set('cacheKey', backboneWebapp.configuration.cacheKey);
    }
    jStorage.set(url, data);
  };

  var loadFromHttp = function (url, dataType, deferObj) {
    var success = function (data) {
      setLocal(url, data);
      deferObj.resolve(data);
    };
    var error = function (jqXHR, textStatus, errorThrown) {
      console.error('loadFile.js: error loading', this.url, ':', errorThrown);
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
  };

  var loadFromLocalStorage = function (url) {
    var jsCacheKey = jStorage.get('cacheKey');
    if (jsCacheKey === backboneWebapp.configuration.cacheKey) {
      return jStorage.get(url, undefined);
    }
    return undefined;
  };

  var startLoading = function (url, dataType, deferObj) {
    // Try from localstorage
    var returnVar = loadFromLocalStorage(url);
    if (returnVar !== undefined) {
      deferObj.resolve(returnVar);
      return;
    }
    // Try with http
    loadFromHttp(url, dataType, deferObj);
  };

  // The exported function
  var loadFile = function (url, dataType) {
    var deferObj = $.Deferred();
    startLoading(url, dataType, deferObj);
    return deferObj.promise();
  };

  return loadFile;
});
