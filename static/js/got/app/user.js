// Copyright 2011 Eitarow Fukamachi. All rights reserved.

/**
 * @fileoverview User's Tasks Page.
 *
 * @author e.arrows@gmail.com (Eitarow Fukamachi)
 */

goog.provide('got.app.User');

goog.require('goog.array');
goog.require('goog.uri.utils');
goog.require('got.app.PC');
goog.require('got.task');



/**
 * @constructor
 * @extends {got.app.PC}
 */
got.app.User = function() {

  goog.base(this);

  /**
   * Element of public timeline.
   * @protected
   */
  this.element = goog.dom.getElement('got-task-list');

  this.loadTasks();
};
goog.inherits(got.app.User, got.app.PC);


/**
 * @protected
 */
got.app.User.prototype.loadTasks = function() {
  this.api.tasks(
      got.app.User.getUser_(),
      goog.bind(function(tasks) {
        this.element.innerHTML = '';
        goog.array.forEach(tasks, function(task) {
          got.task.render(task, this.element);
        }, this);
      }, this));
};


/**
 * @private
 * @return {String} Which user's page.
 */
got.app.User.getUser_ = function() {
  var res = goog.uri.utils.getPath(location.href).match(/^\/tasks\/?(.*)$/, '');

  return res && res[1];
};
