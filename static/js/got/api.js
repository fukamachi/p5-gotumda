// Copyright 2011 Eitarow Fukamachi. All rights reserved.

/**
 * @fileoverview Main package for talking with backend.
 *
 * @author e.arrows@gmail.com (Eitarow Fukamachi)
 */

goog.provide('got.Api');

goog.require('goog.array');
goog.require('goog.events');
goog.require('goog.json');
goog.require('goog.net.EventType');
goog.require('goog.net.XhrIo');
goog.require('goog.uri.utils');



/**
 * Class to request to backend by RESTful API.
 * @param {String} opt_baseUri Base URI of backend to throw requests..
 * @constructor
 */
got.Api = function(opt_baseUri) {
  /**
   * @type {String}
   */
  this.baseUri = opt_baseUri || '/';
};


/**
 * Get all tasks for public timeline.
 * @param {Function(Array.<Object>)} callback Callback function
 *   receives an array contains task objects.
 */
got.Api.prototype.allTasks = function(callback) {
  this.sendRequest('api/all-tasks.json', 'GET', null, callback);
};


/**
 * Get tasks of specified user's.
 * @param {String} userName Which user's tasks.
 * @param {Function(Array.<Object>)} callback Callback function
 *   receives an array contains task objects.
 */
got.Api.prototype.tasks = function(userName, callback) {
  this.sendRequest('api/tasks.json?user=' + (userName || ''),
                   'GET', null, callback);
};


/**
 * Get tasks contains specified project name.
 * @param {String} projectName Which project's tasks.
 * @param {Function(Array.<Object>)} callback Callback function
 *   receives an array contains task objects.
 */
got.Api.prototype.projectTasks = function(projectName, callback) {
  this.sendRequest('api/project.json?project=' + projectName,
                   'GET', null, callback);
};


/**
 * Get a list of watching projects.
 * @param {Function(Array.<Object>)} callback Callback function
 *   recieves a list of project objects.
 */
got.Api.prototype.watchProjects = function(callback) {
  this.sendRequest('api/watch-projects.json', 'GET', null, callback);
};


/**
 * Update a task.
 * @param {Object} params Object represents columns as key and values as values.
 * @param {?Function(Object)} opt_callback Callback function
 *   receives the updated task object.
 */
got.Api.prototype.update = function(params, opt_callback) {
  this.sendRequest('api/update.json', 'POST',
                   params, opt_callback);
};


/**
 * Copy a task and put it into My Tasks.
 * @param {Integer} id ID of the task to copy.
 * @param {?Function(Object)} opt_callback Callback function
 *   receives the new task object.
 */
got.Api.prototype.copy = function(id, opt_callback) {
  this.sendRequest('api/copy.json', 'POST', {'id': id}, opt_callback);
};


/**
 * Move an other user's task into My Tasks.
 * @param {Integer} id ID of the task to move.
 * @param {?Function(Object)} opt_callback Callback function
 *   receives an updated task object.
 */
got.Api.prototype.move = function(id, opt_callback) {
  this.sendRequest('api/move.json', 'POST', {'id': id}, opt_callback);
};


/**
 * Delete a task.
 * @param {Integer} id ID of the task to delete.
 * @param {?Function} opt_callback Callback function
 *   receives nothing.
 */
got.Api.prototype.destroy = function(id, opt_callback) {
  this.sendRequest('api/destroy.json', 'POST', {'id': id}, opt_callback);
};


/**
 * Post a comment to a task.
 * @param {Object} params
 * @param {?Function(Object)} opt_callback
 */
got.Api.prototype.taskComment = function(params, opt_callback) {
  this.sendRequest('api/task-comment.json', 'POST', params, opt_callback);
};


/**
 * Sort tasks in My Tasks.
 * @param {Array.<Integer>} order A permutation of IDs of tasks.
 */
got.Api.prototype.sortTasks = function(order) {
  this.sendRequest('api/sort-tasks.json', 'POST',
                   {'sort_order': order.join(',')});
};


/**
 * Mark a project as watching.
 * @param {String} projectName Project name to mark.
 * @param {Boolean} isWatch Flag if watch or unwatch.
 */
got.Api.prototype.watchProject = function(projectName, isWatch) {
  this.sendRequest('api/watch-project.json', 'POST',
                   {'project': projectName, 'is_watch': isWatch});
};


/**
 * General function to throw a HTTP request through RESTful API.
 * @param {String} uri Where to throw a request.
 * @param {String} method HTTP method.
 * @param {Object=} opt_params POST parameters.
 * @param {Function=} opt_callback Callback function called
 *   when the request is completed.
 */
got.Api.prototype.sendRequest = function(uri, method, opt_params,
                                    opt_callback) {
  opt_params = opt_params || {};
  var xhr = new goog.net.XhrIo();
  var query = goog.uri.utils.buildQueryDataFromMap(opt_params);
  if (goog.isFunction(opt_callback)) {
    goog.events.listen(xhr, goog.net.EventType.COMPLETE,
                       function(e) {
                         var res = e.target.getResponseText();
                         opt_callback(res === '' ? null : goog.json.parse(res));
                       });
  }
  xhr.send(this.baseUri + uri, method, query);
};
