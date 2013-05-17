/* global define */
define(['jquery', 'jed'], function ($, Jed) {
  'use strict';
  var i18n = {
    // We cache already initialized languages in here
    jeds: {},

    sprintf: Jed.sprintf,

    // Helpers for replacing already defined placeholders
    helpers: {
      gettext: function (messageId) {
        return messageId;
      },
      ngettext: function (singular, plural, messageId) {
        return Jed.sprintf(singular, messageId);
      }
    },

    // Placeholder
    _: function (messageId) {
      return i18n.helpers.gettext(messageId);
    },

    // Placeholder
    gettext: function (messageId) {
      return i18n.helpers.gettext(messageId);
    },

    // Placeholder
    ngettext: function (singular, plural, messageId) {
      return i18n.helpers.ngettext(singular, plural, messageId);
    },

    /**
     * Start with this.
     * @param  {string} langCode The frontend language code file to load
     * @return {object}          A deferred object, resolves with the i18n object itself
     */
    init: function (langCode) {
      var self = this;
      var deferObj = $.Deferred();
      if (this.jeds[langCode]) {
        this._changeL10n(langCode);
        deferObj.resolve(this);
      } else {
        $.ajax({
          url: '/languages/' + langCode + '/frontend.json',
          dataType: 'json',
          success: function (l10n) {
            self._initL10n(langCode, l10n);
            self._changeL10n(langCode);
            deferObj.resolve(self);
          },
          error: function (jqXHR, textStatus, errorThrown) {
            console.error('Couldn\'t load l10n file for', langCode, ':', errorThrown);
            deferObj.resolve(self);
          }
        });
      }
      return deferObj.promise();
    },

    _initL10n: function (langCode, l10n) {
      this.jeds[langCode] = new Jed({
        domain: 'frontend',
        'missing_key_callback': function (messageId) {
          console.warn(Jed.sprintf('MISSING MESSAGE ID (%s): %s', langCode, messageId));
          return messageId;
        },
        'locale_data': l10n
      });
    },

    _changeL10n: function (langCode) {
      var self = this;
      this.helpers.gettext = function (messageId) {
        return self.jeds[langCode].gettext(messageId);
      };
      this.helpers.ngettext = function (singular, plural, messageId) {
        return self.jeds[langCode].ngettext(singular, plural, messageId);
      };
    }
  };

  return i18n;
});
