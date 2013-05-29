/* global define */
define(['jquery', 'Backbone', 'BackboneWebapp'], function ($, Backbone, BackboneWebapp) {
  'use strict';
  var TopicName = Backbone.View.extend({
    initialize: function () {
      this.adjustTimeout = null;
      this.render();
      return this;
    },

    _adjustTooltip: function (tooltip) {
      var self = this;
      var tip = tooltip.tip();
      if (tip.hasClass('in')){
        var pos = tooltip.getPosition();
        var actualWidth = tip[0].offsetWidth;
        var actualHeight = tip[0].offsetHeight;
        var tp;
        switch (tooltip.options.placement) {
        case 'bottom':
          tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2};
          break;
        case 'top':
          tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2};
          break;
        case 'left':
          tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth};
          break;
        case 'right':
          tp = {top: pos.top + (pos.height / 2) - (actualHeight / 2), left: pos.left + pos.width};
          break;
        }
        tooltip.applyPlacement(tp, tooltip.options.placement);
        this.adjustTimeout = setTimeout(function () {
          self._adjustTooltip(tooltip);
        }, 1000);
      }
    },

    render: function () {
      var self = this;
      $.when(
        BackboneWebapp.collections.topics.getDeferred(this.options.topicId)
      ).then(function () {
        self.model = BackboneWebapp.collections.topics.get(self.options.topicId);
        self.$el.html(self.model.get('htmlName')).tooltip({
          title: function () {
            var myDiv = this;
            if (self.adjustTimeout) {
              clearTimeout(self.adjustTimeout);
            }
            self.adjustTimeout = setTimeout(function () {
              self._adjustTooltip($(myDiv).data('tooltip'));
            }, 100);
            return self.model.get('currParsedCommentText');
          },
          html: true,
          placement: 'right'
        });
      });
    }
  });
  return TopicName;
});
