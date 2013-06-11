/*global define */
define(['jquery', 'jStorage', 'BackboneWebapp'], function ($, jStorage, BackboneWebapp) {
  'use strict';
  /**
   * Load a file from any given url, but check if it is already in local cache
   * @param  {string} url      the url to load
   * @param  {string} dataType the dataType to enforce (@see jQuery.ajax dataType)
   * @return {object}          a deferred object, resolves with the file when ready, or rejects with the error message when fails
   */
  var setLocal = function (url, data) {
    if (jStorage.get('cacheKey') !== BackboneWebapp.configuration.cacheKey) {
      jStorage.flush();
      jStorage.set('cacheKey', BackboneWebapp.configuration.cacheKey);
    }
    jStorage.set(url, data);
  };

  var loadFromHttp = function (url, dataType) {
    var deferObj = $.Deferred();
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
    return deferObj.promise();
  };

  var loadFromLocalStorage = function (url) {
    var jsCacheKey = jStorage.get('cacheKey');
    if (jsCacheKey === BackboneWebapp.configuration.cacheKey) {
      return jStorage.get(url);
    }
    return null;
  };

  // The exported function
  var loadFile = function (url, dataType) {
    return loadFromLocalStorage(url) || loadFromHttp(url, dataType);
  };

  return loadFile;
});
