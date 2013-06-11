/* global define */
define(['jquery', 'Backbone', 'BackboneWebapp', 'i18n', 'dateTime'], function ($, Backbone, BackboneWebapp, i18n) {
  'use strict';

  var TopicComment = Backbone.View.extend({
    initialize: function () {
      this.$header = this.$el.find('.comment-header-wrapper');
      this.$body = this.$el.find('.comment-body-wrapper');
      this.$footer = this.$el.find('.comment-footer-wrapper');
      this.widgetArray = [];
      this.render();
    },

    render: function () {
      this.$el.attr('id', this.model.get('commentUniqId'));
      this._renderCommentNumber();
      this._renderCommentUser();
      this._renderCommentDate();
      this._renderAnsweredCommentData();
      this.$body.html(this.model.get('commentParsed'));
      return this;
    },

    _renderCommentNumber: function () {
      var self = this;
      this.$commentNumber = this.$header.find('.comment-number');
      this.$commentNumber.attr('href', '/comment/' + this.model.get('commentUniqId') + '/showone/');
      this.$commentNumber.click(function (event) {
        event.preventDefault();
        BackboneWebapp.router.navigate(self.$commentNumber.attr('href'));
      });
      this.$commentNumber.text('#' + this.model.get('commentNumber'));
    },

    _renderCommentUser: function () {
      this.$commentUser = this.$header.find('.comment-username');
      this.widgetArray.push(new BackboneWebapp.views.UserName({
        userId: this.model.get('ownerId'),
        el: this.$commentUser
      }));
    },

    _renderCommentDate: function () {
      this.$commentDate = this.$header.find('.comment-date');
      this.$commentDate.dateTime({
        time: this.model.get('unixTime')
      });
    },

    _renderAnsweredCommentData: function () {
      var self = this;
      this.$answeredCommentWrapper = this.$header.find('.answered-comment-wrapper');
      var answeredCommentUniqId = this.model.get('prevUniqId');
      if (answeredCommentUniqId !== '') {
        $.when(
          BackboneWebapp.collections.topics.getDeferred({id: this.model.get('prevTopicId')})
        ).then(function () {
          var topicModel = BackboneWebapp.collections.topics.findWhere({id: self.model.get('prevTopicId')});
          var myUrl = '/topic/' + topicModel.get('slug') + '/comment/' + self.model.get('prevUniqId') + '/';
          self.$answeredCommentWrapper.append(i18n.sprintf(i18n.gettext('re: %s'), '<a class="preceding"/>'));
          self.$answeredCommentWrapper.find('a.preceding').replaceWith($('<a/>', {
            href: myUrl,
            text: '#' + self.model.get('prevNumber'),
            click: function (event) {
              event.preventDefault();
              BackboneWebapp.router.navigate(myUrl, {trigger: true});
            }
          }));
          self.$answeredCommentWrapper.append(' (');
          var answeredCommentUserWrapper = $('<a/>');
          self.widgetArray.push(new BackboneWebapp.views.UserName({
            userId: self.model.get('prevUserId'),
            el: answeredCommentUserWrapper
          }));
          self.$answeredCommentWrapper.append(answeredCommentUserWrapper);
          self.$answeredCommentWrapper.append(')');
        });
      }
    }

  });

  return TopicComment;
});
