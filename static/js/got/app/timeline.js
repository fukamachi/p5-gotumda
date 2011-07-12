// Copyright 2011 Eitarow Fukamachi. All rights reserved.

/**
 * @fileoverview Public Timeline.
 *
 * @author e.arrows@gmail.com (Eitarow Fukamachi)
 */

goog.provide('got.app.Timeline');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.style');
goog.require('got.app.PC');
goog.require('got.task');
goog.require('got.ui.ContinuousPager');



/**
 * @constructor
 * @extends {got.app.PC}
 */
got.app.Timeline = function() {

  goog.base(this);

  /**
   * Element of public timeline.
   * @protected
   */
  this.element = goog.dom.getElement('got-public-tasks');

  this.loadPublicTasks();
};
goog.inherits(got.app.Timeline, got.app.PC);


/**
 * Load all tasks and render them in the specified element.
 * @protected
 */
got.app.Timeline.prototype.loadPublicTasks = function() {
  this.api.allTasks(
      goog.bind(function(tasks) {
        var element = goog.dom.getElement('got-public-tasks');
        element.innerHTML = '';
        goog.array.forEach(tasks, function(task) {
          got.task.render(task, element, true);
        });
        var pager = new got.ui.ContinuousPager(function(tasks) {
          goog.array.forEach(tasks, function(task) {
            var taskEl = got.task.render(task);
            element.appendChild(taskEl);
          });
        });
        pager.render(element);
      }, this));
};


/**
 * @param {Object} task JSON of a new task.
 */
got.app.Timeline.prototype.onAfterCreate = function(task) {
  got.task.render(task, this.element);
  got.app.Timeline.superClass_.onAfterCreate.call(this, task);
};
