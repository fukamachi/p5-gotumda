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
          got.task.render(task, element);
        });
      }, this));
};

new got.app.Timeline();