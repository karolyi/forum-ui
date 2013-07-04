/*global define*/
define(['jquery', 'jquery-ui'], function ($) {
  'use strict';
  var $window = $(window);
  var windowHeight = $window.height();
  $window.on('resize', function (event) {
    windowHeight = $window.height();
    for (var index = 0; index < $.Forum.lazyLoad.instances.length; index++) {
      var instance = $.Forum.lazyLoad.instances[index];
      instance._onEventWindowResize(event);
    }
  });

  $.widget('Forum.lazyLoad', {
    options: {
      adjustTimeout: 500, // In msecs
      isVisible: false
    },

    _create: function () {
      var self = this;
      // This function needs to be defined here to keep track of the 'this' variable
      this._scrollerCallback = function (event) {
        return self._onEventScroll(event);
      };
      this._isLoaded = false;
      this._isScrollTopAdjusted = false;
      this._isUpwardScrolled = false;
      this._isResizeWatched = false;
      this._adjustIntervalId = null;
      this._lastScrollPos = $window.scrollTop();
      this.currentHeight = this.element.height();
      if (this.options.isVisible) {
        if (this._isInViewport()) {
          this._startLoading();
        } else {
          this._bindScrollEvent();
        }
      }
      $.Forum.lazyLoad.instances.push(this);
      this._super();
    },

    _bindScrollEvent: function () {
      $window.on('scroll', this._scrollerCallback);
    },

    _unbindScrollEvent: function () {
      $window.off('scroll', this._scrollerCallback);
    },

    _isInViewport: function () {
      var windowScrollTop = $window.scrollTop();
      var elementTop = this.element.position().top;
      if (elementTop < windowScrollTop + windowHeight && elementTop > windowScrollTop) {
        return true;
      }
      var elementBottom = this.element.position().top + this.element.height();
      if (elementBottom > windowScrollTop && elementBottom < windowScrollTop + windowHeight) {
        return true;
      }
      return false;
    },

    _onEventScroll: function () {
      if (this._isInViewport()) {
        this._startLoading();
      }
      this._lastScrollPos = $window.scrollTop();
    },

    _onEventWindowResize: function () {
      if (this.options.isVisible) {
        if (this._isResizeWatched) {
          // this._updateHeight();
          return;
        }
        if (!this.element.hasClass('loading')) {
          this._onEventScroll();
          return;
        }
      }
    },

    _startLoading: function () {
      this._isUpwardScrolled = $window.scrollTop() < this._lastScrollPos;
      this._unbindScrollEvent();
      this.element.addClass('loading');
      if (this.element.hasClass('embedded-forum-picture')) {
        this._showImage();
        return;
      }
      if (this.element.hasClass('embedded-player')) {
        this._showEmbeddedPlayer();
        return;
      }
    },

    _showImage: function () {
      var self = this;
      this.element.one('load error abort', function () {
        self._onImageLoaded();
      });
      this.element.attr('src', this.element.attr('data-original'));
      this._adjustIntervalId = setInterval(function () {
        if (self.element.height() !== self.currentHeight) {
          self._adjustScrollTop();
          clearInterval(self._adjustIntervalId);
          self._adjustIntervalId = null;
        }
      }, this.options.adjustTimeout);
    },

    _onImageLoaded: function () {
      this._isLoaded = true;
      this.element.addClass('finished');
      if (this._adjustIntervalId) {
        clearInterval(this._adjustIntervalId);
      }
      this.element.off('load error abort');
      if (!this._isScrollTopAdjusted) {
        this._adjustScrollTop();
      }
      this.currentHeight = this.element.height();
    },

    _showEmbeddedPlayer: function () {
      this._isResizeWatched = true;
      this.element.addClass('finished');
      var scriptContent = this.element.children('script').remove().contents()[0];
      this.element.append($(scriptContent).text());
      var ratioArray = this.element.attr('data-aspect-ratio').split(',');
      for (var index = 0; index < ratioArray.length; index++) {
        var configStr = ratioArray[index];
        if (configStr.indexOf('ratio:') === 0) {
          this._ratioCalc(configStr.substring(6, configStr.length));
        }
        if (configStr.indexOf('maxheight:') === 0) {
          this._heightCalc = parseInt(configStr.substring(10, configStr.length), 10);
        }
      }
      this._updateHeight();
      this._adjustScrollTop();
    },

    _heightCalc: function (width) {
      return width;
    },

    _ratioCalc: function (ratioStr) {
      var ratioArray = ratioStr.split('-');
      var ratio = parseInt(ratioArray[1], 10) / parseInt(ratioArray[0], 10);
      this._heightCalc = function (width) {
        return Math.round(width * ratio);
      };
    },

    _updateHeight: function () {
      var width = this.element.width();
      this.element.height($.isFunction(this._heightCalc) ? this._heightCalc(width) : this._heightCalc);
    },

    _adjustScrollTop: function () {
      this._isScrollTopAdjusted = true;
      var windowScrollTop = $window.scrollTop();
      var elementTop = this.element.position().top;
      var elementBottom = this.element.position().top + this.element.height();
      if (elementTop < windowScrollTop && elementBottom < windowScrollTop) {
        $window.scrollTop(windowScrollTop + (this.element.height() - this.currentHeight));
        return;
      }
      if ((elementBottom > windowScrollTop && elementTop < windowScrollTop) || (this._isUpwardScrolled && elementTop < windowScrollTop + windowHeight)) {
        $window.scrollTop($window.scrollTop() + (this.element.height() - this.currentHeight));
        return;
      }
    },

    _setOption: function (key, value) {
      $.Widget.prototype._setOption.call(this, key, value);
      if (key === 'isVisible') {
        if (value) {
          if (this._isResizeWatched) {
            this._updateHeight();
            return;
          }
          if (!this.element.hasClass('loading')) {
            this._bindScrollEvent();
            this._onEventScroll();
            return;
          }
        } else {
          if (!this.element.hasClass('loading')) {
            this._unbindScrollEvent();
            return;
          }
        }
      }
    },

    destroy: function () {
      if (!this._isLoaded && !this.element.hasClass('loading')) {
        this._unbindScrollEvent();
      }
      var index = $.Forum.lazyLoad.instances.indexOf(this);
      if (index !== -1) {
        $.Forum.lazyLoad.instances.splice(index, 1);
      }
      this._super();
    }
  });

  $.extend($.Forum.lazyLoad, {
    instances: []
  });
});
