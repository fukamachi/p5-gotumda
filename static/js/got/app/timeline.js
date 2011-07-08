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
  this.listenPostButton();
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
        this.listenTaskAction_();
        this.listenCommentEvents_();
      }, this));
};


/**
 * Listen click events on task action (Edit/Delete).
 * @private
 */
got.app.Timeline.prototype.listenTaskAction_ = function() {
  var tasks = goog.dom.getElementsByClass('got-taskitem', this.element);
  goog.array.forEach(tasks, function(task) {
    var actionEl = goog.dom.getElementByClass('got-taskitem-action', task);
    goog.events.listen(
        actionEl.childNodes[0], goog.events.EventType.CLICK,
        function(e) {
          this.api.copy(task['id'], function(res) {
            got.task.render(res, 'got-public-tasks');
          });
        }, false, this);
    goog.events.listen(
        actionEl.childNodes[1], goog.events.EventType.CLICK,
        function(e) {
          this.api.move(task['id'], function(res) {
            goog.dom.removeNode(task);
            got.task.render(res, 'got-public-tasks');
          });
        }, false, this);
  }, this);
};


/**
 * @private
 */
got.app.Timeline.prototype.listenCommentEvents_ = function() {
  var commentLinkEls =
      goog.dom.getElementsByClass('task-comment', this.element);
  goog.array.forEach(commentLinkEls, function(el) {
    var commentFormEl =
        goog.dom.getElementByClass('got-taskitem-comment', el.parentNode);
    goog.events.listen(el, goog.events.EventType.CLICK, function(e) {
      goog.style.showElement(commentFormEl, true);
      commentFormEl.body.focus();
    });
  });
  var commentFormEls =
      goog.dom.getElementsByClass('got-taskitem-comment', this.element);
  goog.array.forEach(commentFormEls, function(el) {
    goog.events.listen(el, goog.events.EventType.SUBMIT, function(e) {
      this.api.taskComment(
          goog.dom.forms.getFormDataMap(el).toObject(), function(comment) {
            el.body.value = '';
            goog.style.showElement(el, false);
          });
    }, false, this);
  }, this);
};

new got.app.Timeline();
