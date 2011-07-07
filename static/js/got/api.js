// Copyright 2011 Eitarow Fukamachi. All rights reserved.

/**
 * @fileoverview Main package for talking with backend.
 *
 * @author e.arrows@gmail.com (Eitarow Fukamachi)
 */

goog.provide('got.Api');

goog.require('goog.array');
goog.require('goog.net.XhrIo');
goog.require('goog.net.CrossDomainRpc');
goog.require('goog.net.EventType');
goog.require('goog.events');
goog.require('goog.uri.utils');

/**
 * Class to request to backend by RESTful API.
 * @param {String} baseUri
 * @constructor
 */
got.Api = function(baseUri) {
  /**
   * @type {String}
   */
  this.baseUri = baseUri;
};

/**
 * Request to 'api/all-tasks.json'.
 * @param {Function(Array.<Object>)} callback
 */
got.Api.prototype.allTasks = function(callback) {
  this.sendRequest('api/all-tasks.json', 'GET', null, callback);
};

got.Api.prototype.tasks = function(user, callback) {
  this.sendRequest('api/tasks.json?user='+user, 'GET', null, callback);
};

got.Api.prototype.myProjects = function(callback) {
  this.sendRequest('api/my-projects.json', 'GET', null, callback);
};

got.Api.prototype.projectTasks = function(project, callback) {
  this.sendRequest('api/project.json?project='+project, 'GET', null, callback);
};

/**
 * Request to 'api/update.json'.
 * @param {Object} params
 * @param {Function=} opt_callback
 */
got.Api.prototype.update = function(params, opt_callback) {
  this.sendRequest('api/update.json', 'POST',
                  params, opt_callback);
};

got.Api.prototype.copy = function(id, opt_callback) {
  this.sendRequest('api/copy.json', 'POST', {'id': id}, opt_callback);
};

got.Api.prototype.move = function(id, opt_callback) {
  this.sendRequest('api/move.json', 'POST', {'id': id}, opt_callback);
};

/**
 * Request to 'api/destroy.json'.
 * @param {Integer} id
 */
got.Api.prototype.destroy = function(id) {
  this.sendRequest('api/destroy.json', 'POST', {'id': id});
};

/**
 * Request to 'api/sort-tasks.json'.
 * @param {Array.<Integer>} order
 */
got.Api.prototype.sortTasks = function(order) {
  this.sendRequest('api/sort-tasks.json', 'POST', {'sort_order': order.join(',')});
};

got.Api.prototype.watchProject = function(project, isWatch) {
  this.sendRequest('api/watch-project.json', 'POST',
                   {'project': project, 'is_watch': isWatch});
};

got.Api.prototype.taskComment = function(params, opt_callback) {
  this.sendRequest('api/task-comment.json', 'POST', params, opt_callback);
};

/**
 * General function to throw a HTTP request through RESTful API.
 * @param {String} uri
 * @param {String} method
 * @param {Object=} opt_params
 * @param {Function=} opt_callback
 * @param {Boolean} opt_isCrossDomain
 */
got.Api.prototype.sendRequest = function(uri, method, opt_params,
                                  opt_callback, opt_isCrossDomain) {
  opt_params = opt_params || {};
  if (opt_isCrossDomain) {
    goog.net.CrossDomainRpc.send(
      this.baseUri + uri, false, method, opt_params);
  } else {
    var xhr = new goog.net.XhrIo();
    var query = goog.uri.utils.buildQueryDataFromMap(opt_params);
    if (goog.isFunction(opt_callback)) {
      goog.events.listen(xhr, goog.net.EventType.COMPLETE,
                         function(e) {
                           var res = e.target.getResponseJson();
                           opt_callback(res);
                         });
    }
    xhr.send(this.baseUri + uri, method, query);
  }
};
