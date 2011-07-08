// Copyright 2011 Eitarow Fukamachi. All rights reserved.

/**
 * @fileoverview User's Task Page.
 *
 * @author e.arrows@gmail.com (Eitarow Fukamachi)
 */

goog.provide('got.app.Tasks');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.fx.DragListDirection');
goog.require('goog.fx.DragListGroup');
goog.require('got.app.PC');
goog.require('got.task');



/**
 * @constructor
 * @extends {got.app.PC}
 */
got.app.Tasks = function() {

  goog.base(this);

  /**
   * Element of public timeline.
   * @protected
   */
  this.element = goog.dom.getElement('got-task-list');

  this.loadTasks();
};
goog.inherits(got.app.Tasks, got.app.PC);


/**
 * @protected
 */
got.app.Tasks.prototype.loadTasks = function() {
  this.api.tasks(
      got.app.Tasks.getUser_(),
      goog.bind(function(tasks) {
        var curEl = goog.dom.getElement('got-current-tasks');
        var doneEl = goog.dom.getElement('got-done-tasks');
        curEl.innerHTML = '';
        goog.array.forEach(tasks, function(task) {
          if (task['is_done']) {
            got.task.renderLine(task, doneEl);
          } else {
            got.task.renderLine(task, curEl);
          }
        });
        if (got.IS_LOGINED) {
          this.listenDragEvents(curEl);
          this.listenCheckEvents();
        }
      }, this)
  );
};


/**
 * Event handler fired on end of dragging.
 * @param {goog.events.BrowserEvent} e Event fired on end of dragging.
 * @private
 */
got.app.Tasks.prototype.onDragEnd_ = function(e) {
  var taskEls =
      goog.dom.getElementsByClass('got-taskitemline', this.taskListEl_);
  this.api.sortTasks(goog.array.map(taskEls, function(el) {
    return el['id'];
  }));
};


/**
 * Specify which element is draggable.
 * @param {Element} item Possible element to drag.
 * @return {Element} Draggable element.
 * @private
 */
got.app.Tasks.prototype.getHandlerForDragItem_ = function(item) {
  return goog.dom.getElementByClass('got-taskitem-body', item);
};


/**
 * Listen drag events of tasks.
 * @protected
 */
got.app.Tasks.prototype.listenDragEvents = function() {

  /**
   * @type {goog.fx.DragListGroup}
   * @protected
   */
  var dlg = this.dlg_ = new goog.fx.DragListGroup();

  dlg.addDragList(goog.dom.getElement('got-current-tasks'),
                  goog.fx.DragListDirection.DOWN);
  dlg.setDragItemHoverClass('cursor-move');
  dlg.setDraggerElClass('cursor-move dragging');
  dlg.setFunctionToGetHandleForDragItem(
      this.getHandlerForDragItem_
  );
  goog.events.listen(dlg, goog.fx.DragListGroup.EventType.DRAGEND,
                     this.onDragEnd_, false, this);

  dlg.init();
};


/**
 * Event handler fired on check of checkboxes.
 * @param {goog.events.BrowserEvent} e Event object.
 * @private
 */
got.app.Tasks.prototype.onCheck_ = function(e) {
  var checkEl = e.target;
  var taskEl = goog.dom.getAncestorByClass(checkEl, 'got-taskitemline');
  goog.dom.removeNode(taskEl);
  if (checkEl.checked) {
    goog.events.unlisten(taskEl, goog.events.EventType.MOUSEOVER,
                         this.dlg_.handleDragItemMouseover_, false, this.dlg_);
    var doneTaskListEl = goog.dom.getElement('got-done-tasks');
    goog.dom.insertChildAt(doneTaskListEl, taskEl, 0);
  } else {
    goog.events.listen(taskEl, goog.events.EventType.MOUSEOVER,
                       this.dlg_.handleDragItemMouseover_, false, this.dlg_);
    var curTaskListEl = goog.dom.getElement('got-current-tasks');
    curTaskListEl.appendChild(taskEl);
  }
  this.api.update(
      {'id': taskEl['id'], 'is_done': checkEl.checked}
  );
};


/**
 * Listen click events of checkboxes.
 * @protected
 */
got.app.Tasks.prototype.listenCheckEvents = function() {
  var checkboxes =
      goog.dom.getElementsByClass('got-taskitem-done', this.element);
  goog.array.forEach(checkboxes, function(checkEl) {
    goog.events.listen(checkEl, goog.events.EventType.CLICK,
                       this.onCheck_, false, this);
  }, this);
};


/**
 * @private
 * @return {String} Which user's page.
 */
got.app.Tasks.getUser_ = function() {
  var res = goog.uri.utils.getPath(location.href).match(/^\/?(.*)\/tasks$/, '');

  return res && res[1];
};

new got.app.Tasks();
