/* global define */
define(['jquery', 'BackboneWebapp', 'i18n', 'jquery-ui'], function ($, BackboneWebapp, i18n) {
  'use strict';
  var timeZoneSecsdiff,
    updateTimeoutId,
    unixTimes = {},
    dateFormat = {},
    tzString;

  $.widget('Forum.dateTime', {
    options: {
      time: Math.floor(((new Date()).getTime()) / 1000),
      tooltip: {
        html: false,
        placement: 'top',
      },
    },

    _create: function() {
      this._createParsedValues();
      this.update();
      this.element.attr('data-toggle', 'tooltip');
      this._updateTooltip();
      $.Forum.dateTime.instances.push(this);
      $.Widget.prototype._create.call(this);
    },

    _createParsedValues: function () {
      var dateObj = new Date(this.options.time * 1000);
      this._parsedValues = {
        year: dateObj.getFullYear(),
        month: dateObj.getMonth() + 1,
        dayOfMonth: dateObj.getDate(),
        dayOfWeek: dateObj.getDay(),
        amPm: dateObj.getHours() > 12 ? 'pm' : 'am',
        amPmHour: dateObj.getHours() > 12 ? dateObj.getHours() - 12 : dateObj.getHours(),
        hour: dateObj.getHours(),
        minute: dateObj.getMinutes(),
        second: dateObj.getSeconds()
      };
    },

    destroy: function() {
      var elementIndex = $.Forum.DateTime.instances.indexOf(this);
      if (elementIndex !== -1) {
        $.Forum.dateTime.instances.splice(elementIndex, 1);
      }
      $.Widget.prototype.destroy.call(this);
    },

    update: function() {
      this.element.html(this.shortDate());
    },

    _updateTooltip: function () {
      var self = this;
      var tooltipOptions = this.options.tooltip;
      tooltipOptions.title = function () {
        return self.longDate();
      };
      this.element.tooltip(tooltipOptions);
    },

    longDate: function() {
      return i18n.sprintf(i18n.gettext('%4$s, %2$s %3$s, %1$d, %5$02d:%6$02d:%7$02d %10$s'), [
        this._parsedValues.year, // 1
        dateFormat.monthNames.long[this._parsedValues.month - 1], // 2
        this._parsedValues.dayOfMonth, // 3
        dateFormat.dayNames.long[this._parsedValues.dayOfWeek], // 4
        this._parsedValues.hour, // 5
        this._parsedValues.minute, // 6
        this._parsedValues.second, // 7
        this._parsedValues.amPmHour, // 8
        this._parsedValues.amPm, // 9
        tzString // 10
      ]);
    },

    shortDate: function() {
      var time = this.options.time;
      var timeWithTimeZone = time + timeZoneSecsdiff; // Might be that its a subtraction, really
      var difference = unixTimes.currTime - timeWithTimeZone;
      if (difference < 60) {
        return i18n.gettext('less then a minute ago');
      }
      if (difference < 3600) {
        return i18n.sprintf(i18n.ngettext('%d minute ago', '%d minutes ago'), Math.floor(difference / 60));
      }
      if (difference > 3600 && difference < 7200) {
        return i18n.gettext('about an hour ago');
      }
      if (timeWithTimeZone > unixTimes.oneDayBeforeBegin) {
        // Calculate hours difference
        var hourValue = Math.floor((unixTimes.currTime - timeWithTimeZone) / 3600);
        return i18n.sprintf(i18n.ngettext('%d hour ago', '%s hours ago', hourValue), hourValue);
      }
      if (timeWithTimeZone > unixTimes.yesterdayBegin) {
        return i18n.sprintf(i18n.gettext('Yesterday at %1$02d:%2$02d'), [
          this._parsedValues.hour,
          this._parsedValues.minute,
          this._parsedValues.amPmHour,
          this._parsedValues.amPm
        ]);
      }
      if (timeWithTimeZone > unixTimes.fourDaysBeforeBegin) {
        return i18n.sprintf(i18n.gettext('%1$s at %2$02d:%3$02d'), [
          dateFormat.dayNames.short[this._parsedValues.dayOfWeek],
          this._parsedValues.hour,
          this._parsedValues.minute,
          this._parsedValues.amPmHour,
          this._parsedValues.amPm
        ]);
      }
      if (timeWithTimeZone > unixTimes.thisYearBegin) {
        return i18n.sprintf(i18n.gettext('%1$s %2$d at %3$02d:%4$02d'), [
          dateFormat.monthNames.short[this._parsedValues.month - 1],
          this._parsedValues.dayOfMonth,
          this._parsedValues.hour,
          this._parsedValues.minute,
          this._parsedValues.amPmHour,
          this._parsedValues.amPm
        ]);
      }
      return i18n.sprintf(i18n.gettext('%2$s %3$d, %1$d'), [
        this._parsedValues.year,
        dateFormat.monthNames.short[this._parsedValues.month - 1],
        this._parsedValues.dayOfMonth,
        this._parsedValues.hour,
        this._parsedValues.minute,
        this._parsedValues.amPmHour,
        this._parsedValues.amPm
      ]);
    },
  });

  var startUpdate = function () {
    if (updateTimeoutId) {
      clearTimeout(updateTimeoutId);
    }
    var nowDate = new Date();
    var nextMinute = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowDate.getHours(), nowDate.getMinutes(), 60);
    var millisecs = nextMinute - nowDate;
    updateTimeoutId = setTimeout(function () {
      startUpdate();
    }, millisecs + 500); // Plus 500 for safety
    calculateUnixTimes();
    // UPDATE ALL THE INSTANCES
    for (var element = 0; element < $.Forum.dateTime.instances.length; element++) {
      $.Forum.dateTime.instances[element].update();
    }
  };

  var calculateUnixTimes = function() {
    var nowDate = new Date();
    unixTimes.currTime = nowDate;
    unixTimes.thisYearBegin = new Date(nowDate.getFullYear(), 0, 1, 0, 0, 0);
    unixTimes.todayBegin = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), 0, 0, 0);
    unixTimes.yesterdayBegin = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() - 1, 0, 0, 0);
    unixTimes.fourDaysBeforeBegin = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() - 3, 0, 0, 0);
    unixTimes.oneDayBeforeBegin = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate() - 1, nowDate.getHours(), nowDate.getMinutes(), nowDate.getSeconds());
    // Translate all values to unix epoch seconds
    for (var key in unixTimes) {
      unixTimes[key] = Math.floor(unixTimes[key].getTime() / 1000);
    }
  };

  var init = function () {
    var myTimeZone = (new Date()).getTimezoneOffset();
    timeZoneSecsdiff = (myTimeZone + BackboneWebapp.configuration.timeZoneDiff) * 60;
    tzString = 'GMT' + myTimeZone > 0 ? '-' : '+';
    tzString += i18n.sprintf('%02d', Math.floor(Math.abs(myTimeZone) / 60));
    tzString += i18n.sprintf('%02d', Math.abs(myTimeZone) % 60);
    changeLanguage();
    startUpdate();
  };

  var changeLanguage = function() {
    dateFormat.dayNames = {
      short: [
        i18n.gettext('Sun'),
        i18n.gettext('Mon'),
        i18n.gettext('Tue'),
        i18n.gettext('Wed'),
        i18n.gettext('Thu'),
        i18n.gettext('Fri'),
        i18n.gettext('Sat')
      ],
      long: [
        i18n.gettext('Sunday'),
        i18n.gettext('Monday'),
        i18n.gettext('Tuesday'),
        i18n.gettext('Wednesday'),
        i18n.gettext('Thursday'),
        i18n.gettext('Friday'),
        i18n.gettext('Saturday')
      ],
    };
    dateFormat.monthNames = {
      short: [
        i18n.gettext('Jan'),
        i18n.gettext('Feb'),
        i18n.gettext('Mar'),
        i18n.gettext('Apr'),
        i18n.gettext('May_short'),
        i18n.gettext('Jun'),
        i18n.gettext('Jul'),
        i18n.gettext('Aug'),
        i18n.gettext('Sep'),
        i18n.gettext('Oct'),
        i18n.gettext('Nov'),
        i18n.gettext('Dec'),
      ],
      long: [
        i18n.gettext('January'),
        i18n.gettext('February'),
        i18n.gettext('March'),
        i18n.gettext('April'),
        i18n.gettext('May'),
        i18n.gettext('June'),
        i18n.gettext('July'),
        i18n.gettext('August'),
        i18n.gettext('September'),
        i18n.gettext('October'),
        i18n.gettext('November'),
        i18n.gettext('December')
      ]
    };
    for (var element = 0; element < $.Forum.dateTime.instances.length; element++) {
      $.Forum.dateTime.instances[element].update();
    }
  };

  $.extend($.Forum.dateTime, {
    instances: [],
    dateFormat: {}
  });

  return {
    init: init,
    changeLanguage: changeLanguage
  };
});
