/*global define*/
define(['jquery', 'jquery-ui'], function ($) {
  'use strict';
  var $window = $(window);
  var windowHeight = $window.height();
  $window.on('resize', function (event) {
    windowHeight = $window.height();
  });

  $.widget('Forum.lazyImageLoad', {
    options: {
      adjustTimeout: 500, // In msecs
    },

    _create: function () {
      var self = this;
      this._scrollerCallback = function (event) {
        return self._onEventScroll(event);
      };
      this._isLoadStarted = false;
      this._isLoaded = false;
      this._isScrollEventWatched = false;
      this._isScrollTopAdjusted = false;
      this._isUpwardScrolled = false;
      this._adjustIntervalId = null;
      this._lastScrollPos = $window.scrollTop();
      this.element.addClass('preload');
      this.origHeight = this.element.height();
      this.element.one('load error abort', function () {
        self._onImageLoaded();
      });
      if (this._isInViewport()) {
        this._startLoading();
      } else {
        this._isScrollEventWatched = true;
        $window.on('scroll', this._scrollerCallback);
      }
    },

    _isInViewport: function () {
      var windowScrollTop = $window.scrollTop();
      var elementTop = this.element.position().top;
      var elementBottom = this.element.position().top + this.element.height();
      if (elementTop < windowScrollTop + windowHeight && elementTop > windowScrollTop) {
        return true;
      }
      if (elementBottom > windowScrollTop && elementBottom < windowScrollTop + windowHeight) {
        return true;
      }
      return false;
    },

    _onEventScroll: function (event) {
      if (!this._isLoadStarted && this._isInViewport()) {
        this._startLoading();
      }
      this._lastScrollPos = $window.scrollTop();
    },

    _startLoading: function () {
      var self = this;
      this._isLoadStarted = true;
      this._isUpwardScrolled = $window.scrollTop() < this._lastScrollPos;
      if (this._isScrollEventWatched) {
        $window.off('scroll', this._scrollerCallback);
      }
      this.element.removeClass('preload');
      this.element.attr('src', this.element.attr('data-original'));
      this._adjustIntervalId = setInterval(function () {
        if (self.element.height() !== self.origHeight) {
          console.log('setInterval');
          self._adjustScrollTop();
          clearInterval(self._adjustIntervalId);
          self._adjustIntervalId = null;
        }
      }, this.options.adjustTimeout);
    },

    _adjustScrollTop: function () {
      this._isScrollTopAdjusted = true;
      if (this.element.is(':visible')) {
        var windowScrollTop = $window.scrollTop();
        var elementTop = this.element.position().top;
        var elementBottom = this.element.position().top + this.element.height();
        if (elementTop < windowScrollTop && elementBottom < windowScrollTop) {
          $window.scrollTop(windowScrollTop + (this.element.height() - this.origHeight));
          return;
        }
        if ((elementBottom > windowScrollTop && elementTop < windowScrollTop) || (this._isUpwardScrolled && elementTop < windowScrollTop + windowHeight)) {
          $window.scrollTop($window.scrollTop() + (this.element.height() - this.origHeight));
          return;
        }
      }
    },

    _onImageLoaded: function () {
      this._isLoaded = true;
      if (this._adjustIntervalId) {
        clearInterval(this._adjustIntervalId);
      }
      this.element.off('load error abort');
      if (!this._isScrollTopAdjusted) {
        this._adjustScrollTop();
      }
    },

    destroy: function () {
      if (!this._isLoaded && this._isScrollEventWatched) {
        $window.off('scroll', this._scrollerCallback);
      }
      this._super();
    }
  });
});