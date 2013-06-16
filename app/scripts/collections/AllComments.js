/* global define */
define(['models/Comment', 'underscore', 'collections/CommentsBase'], function (Comment, _, CommentsBase) {
  'use strict';
  var AllComments = CommentsBase.extend({
    constructor: function () {
      CommentsBase.prototype.constructor.apply(this, arguments);
      this._startCleaner();
    },

    _startCleaner: function () {
      var self = this;
      setInterval(function () {
        var modelsToRemove = [];
        for (var index = 0; index < self.length; index++) {
          var model = self.at(index);
          if (_.size(model._events) === 0 || _.size(model._events.all) === 1) {
            // This means we are the only collection listening for this model, since collection listens to 'all' per default
            modelsToRemove.push(model);
          }
        }
        console.log('cucc to remove', modelsToRemove);
        self.remove(modelsToRemove);
      }, 61 * 1000);
    },

  });
  return AllComments;
});

