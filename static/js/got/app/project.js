// Copyright 2011 Eitarow Fukamachi. All rights reserved.

/**
 * @fileoverview Project tasks.
 *
 * @author e.arrows@gmail.com (Eitarow Fukamachi)
 */

goog.provide('got.app.Project');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.classes');
goog.require('goog.uri.utils');
goog.require('got.app.PC');
goog.require('got.task');



/**
 * @constructor
 * @extends {got.app.PC}
 */
got.app.Project = function() {

  goog.base(this);

  /**
   * Element of public timeline.
   * @protected
   */
  this.element = goog.dom.getElement('got-project-tasks');

  this.loadProjectTasks();

  if (goog.dom.getElement('watch-button')) {
    var element = goog.dom.getElement('watch-button');
    goog.events.listen(element, goog.events.EventType.MOUSEUP, function(e) {
      var isWatch = goog.dom.classes.toggle(element, 'watching');
      element.innerHTML = isWatch ? 'Unwatch' : 'Watch';
      this.api.watchProject(
          got.app.Project.getProject_(),
          isWatch);
    }, false, this);
  }
};
goog.inherits(got.app.Project, got.app.PC);


/**
 * @protected
 */
got.app.Project.prototype.loadProjectTasks = function() {
  this.api.projectTasks(
      got.app.Project.getProject_(),
      goog.bind(function(tasks) {
        var element = goog.dom.getElement('got-project-tasks');
        element.innerHTML = '';
        goog.array.forEach(tasks, function(task) {
          got.task.render(task, element);
        });
      })
  );
};


/**
 * @private
 * @return {String} Project name.
 */
got.app.Project.getProject_ = function() {
  return goog.uri.utils.getPath(location.href).replace(/^\/project\//, '');
};
