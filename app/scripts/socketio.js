/* global define */
define(['jquery', 'BackboneWebapp'], function ($, BackboneWebapp) {
  'use strict';
  var socket;
  var subscribedPaths = {};
  var allowedPaths = [];
  var authIntervalId;
  var deferObj = $.Deferred();

  var subscribe = function (path, event) {
    if (allowedPaths.indexOf(path) === -1) {
      console.error('socketio.js: subscribe to non-allowed path', path);
      return;
    }
    if (subscribedPaths[path] === undefined) {
      socket.emit('subscribe', {
        path: path
      });
      subscribedPaths[path] = [];
    }
    subscribedPaths[path].push(event);
  };

  var unsubscribe = function (path, event) {
    if (subscribedPaths[path] !== undefined) {
      var indexOf = $.inArray(event, subscribedPaths[path]);
      if (indexOf !== -1) {
        subscribedPaths.splice(indexOf, 1);
      }
      if (subscribedPaths[path].length === 0) {
        delete(subscribedPaths[path]);
        socket.emit('unsubscribe', {
          path: path
        });
      }
    }
  };

  var _onEventPath = function (data) {
    if (data.path) {
      if ($.type(subscribedPaths[data.path]) === 'array') {
        for (var element = 0; element < subscribedPaths[data.path].length; element++) {
          subscribedPaths[data.path][element](data);
        }
      }
    }
  };

  var _onEventGlobal = function (data) {
    console.debug('_onEventGlobal', data);
  };

  var authenticate = function (isFirstTime) {
    var urlPart = isFirstTime ? 'auth' : 'heartbeat';
    $.ajax({
      url: BackboneWebapp.configuration.apiHost + '/socket/' + urlPart + '/' + socket.socket.sessionid,
      xhrFields: {
        withCredentials: true
      },
      success: function (data) {
        $.noop(data);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error('SOCKET AUTH FAILED: ', errorThrown);
        document.location.reload(true);
      }
    });
  };

  var _onConnect = function () {
    authenticate(true);
    if (authIntervalId === undefined) {
      authIntervalId = setInterval(function () {
        authenticate(false);
      }, BackboneWebapp.configuration.socketAuthInterval * 1000);
    }
  };

  var _onEventLaunch = function (data) {
    console.debug('_onEventLaunch', data);
    allowedPaths = data;
    $.each(subscribedPaths, function (path) {
      socket.emit('subscribe', {
        path: path
      });
    });
    deferObj.resolve();
  };

  var init = function () {
    require([BackboneWebapp.configuration.socketServerUrl + '/socket.io/socket.io.js'], function (io) {
      socket = io.connect(BackboneWebapp.configuration.socketServerUrl);
      socket.on('connect', _onConnect);
      socket.on('path-event', _onEventPath);
      socket.on('global-event', _onEventGlobal);
      socket.on('launch', _onEventLaunch);
    });
    return deferObj;
  };

  return {
    init: init,
    subscribe: subscribe,
    unsubscribe: unsubscribe
  };
});
