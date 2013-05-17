/* global define */
define(['jquery'], function ($) {
  'use strict';

  var backgroundChanger = {
    bgImageArray: [],
    changeTime: 5 * 60 * 1000, // 5 Minutes by default

    init: function () {
      this._backgroundWrapperArray = [
        $('<div/>', {
          'class': 'body-background-wrapper fade'
        }),
        $('<div/>', {
          'class': 'body-background-wrapper fade'
        })
      ];
      $('body').prepend(this._backgroundWrapperArray[1]);
      $('body').prepend(this._backgroundWrapperArray[0]);
      this._loadImageCache = [];
      this._selectedBackground = 1; // When changing, the first will start
      this._selectedBefore = null;
      this._selected = null;
      this._changeIntervalId = null;
    },

    /**
     * Start the background changer
     * @param  {object} config {bgImageArray: [], changeTime: 5000} An array containing the image urls, and the change timeintervals
     * @return {null}
     */
    start: function (config) {
      var self = this;
      this.bgImageArray = config.bgImageArray;
      this.changeTime = config.changeTime || this.changeTime;
      this._changeIntervalId = setInterval(function () {
        self.change();
      }, this.changeTime);
      // Start changing right away
      this.change();
    },

    change: function () {
      var self = this;
      this.nextRandom();
      var selectedSrc = this.bgImageArray[this._selected];
      $.when(this.preload(selectedSrc))
      .then(function () {
        self._backgroundWrapperArray[self._selectedBackground].removeClass('in');
        self._selectedBackground = 1 - self._selectedBackground;
        self._backgroundWrapperArray[self._selectedBackground].css('background-image', 'url(\'' + selectedSrc + '\')').addClass('in');
      });
    },

    preload: function (imageSrc) {
      var self = this;
      if (typeof this._loadImageCache[imageSrc] === 'undefined') {
        this._loadImageCache[imageSrc] = $.Deferred();
        var preloader         = new Image();
        preloader.onload  = function() {
          self._loadImageCache[imageSrc].resolve(this);
        };
        preloader.onerror = function() {
          self._deferredObj.reject(this.src);
          delete(self._loadImageCache[imageSrc]);
        };
        preloader.src     = imageSrc;
      }
      return this._loadImageCache[imageSrc].promise();
    },

    nextRandom: function() {
      var backgroundImagesLength = this.bgImageArray.length;
      if (backgroundImagesLength > 0) {
        if (backgroundImagesLength > 1) {
          while(this._selected === this._selectedBefore) {
            this._selected = Math.floor(Math.random() * backgroundImagesLength);
          }
          this._selectedBefore = this._selected;
        } else {
          this._selected = 0;
          this._selectedBefore = 0;
        }
      }
    },

  };

  backgroundChanger.init();

  return backgroundChanger;
});
