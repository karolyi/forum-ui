/* global define */
define(['jquery', 'BackboneWebapp', 'underscore'], function ($, BackboneWebapp, _) {
  'use strict';
  var SemaphoreGetter = function (options) {
    this.init(options);
  };

  SemaphoreGetter.prototype.init = function (options) {
    this.sentSemaphores = [];
    this.url = options.url;
    this.successCallback = options.successCallback;
  };

  SemaphoreGetter.prototype._createNew = function () {
    this.semaphore = {
      permits: 1,
      deferredObj: $.Deferred(),
      termArray: []
    };
  };

  SemaphoreGetter.prototype.acquire = function () {
    if (this.semaphore === undefined) {
      this._createNew();
    } else {
      this.semaphore.permits++;
    }
    // console.log('acquire', this.url, this.semaphore.permits);
  };

  SemaphoreGetter.prototype.addTerm = function(options) {
    if (_.size(options) > 0) {
      this.acquire();
      this.semaphore.termArray.push(options);
    }
    return this.release().deferredObj.promise();
  };

  SemaphoreGetter.prototype.release = function() {
    var actualSemaphore = this.semaphore;
    // Check if last permit released
    if (this.semaphore.permits-- === 1) {
      this._launchGet();
    }
    // console.log('release', this.url, actualSemaphore.permits);
    return actualSemaphore;
  };

  SemaphoreGetter.prototype._launchGet = function() {
    var self = this;
    var actualSemaphore = this.semaphore;
    this.semaphore = undefined;
    if (actualSemaphore.termArray.length > 0) {
      this.sentSemaphores.push(actualSemaphore);
      var url = BackboneWebapp.configuration.apiHost + this.url;
      $.ajax({
        url: url,
        dataType: 'json',
        type: 'POST',
        data: JSON.stringify(actualSemaphore.termArray),
        contentType : 'application/json',
        xhrFields: {
          withCredentials: true
        },
        success: function (data) {
          if (data.errors.length > 0) {
            console.error(data.errors.join('\n'));
          }
          self.successCallback(data.result);
          actualSemaphore.deferredObj.resolve();
          self.sentSemaphores.splice(self.sentSemaphores.indexOf(actualSemaphore), 1);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          actualSemaphore.deferredObj.fail(errorThrown);
          console.error('Failed to retrieve url:', url, ':', errorThrown);
        }
      });
    } else {
      actualSemaphore.deferredObj.resolve([]);
    }
  };

  return SemaphoreGetter;
});
