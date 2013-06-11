/* global define */
define(['jquery', 'Backbone'], function ($, Backbone) {
  'use strict';
  var TopicName = Backbone.View.extend({
    initialize: function () {
      this.adjustTimeout = null;
      this.render();
    },

    options: {
      showTooltip: true,
      contentProperty: 'htmlName',
      setHref: true,
      onClick: $.noop,
      tooltipPlacement: 'top',
      tooltipContentProperty: 'currParsedCommentText'
    },

    _adjustTooltip: function (tooltip) {
      var self = this;
      var tip = tooltip.tip();
      if (tip.hasClass('in')){
        var pos = tooltip.getPosition();
        var actualWidth = tip[0].offsetWidth;
        var actualHeight = tip[0].offsetHeight;
        var tp;
        var placement = typeof tooltip.options.placement === 'function' ?
          tooltip.options.placement.call(tooltip, tip[0], $(tooltip)[0]) :
          tooltip.options.placement;

        switch (placement) {
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
      this.$el.html(this.model.get(this.options.contentProperty));
      if (this.options.showTooltip) {
        this.$el.tooltip({
          title: function () {
            var myDiv = this;
            if (self.adjustTimeout) {
              clearTimeout(self.adjustTimeout);
            }
            self.adjustTimeout = setTimeout(function () {
              self._adjustTooltip($(myDiv).data('tooltip'));
            }, 100);
            return self.model.get(self.options.tooltipContentProperty);
          },
          html: true,
          placement: this.options.tooltipPlacement
        });
      }
      if (this.options.setHref) {
        this.$el.attr('href', '/topic/' + this.model.get('slug') + '/page/last/');
      }
      this.$el.click(function (event) {
        return self.options.onClick(event, self.model);
      });
    }
  });
  return TopicName;
});
