// Copyright 2011 Eitarow Fukamachi. All rights reserved.

/**
 * @fileoverview JavaScript used in PC browser.
 *
 * @author e.arrows@gmail.com (Eitarow Fukamachi)
 */

goog.provide('got.app.pc');
goog.provide('got.app.PC');

goog.require('got.Api');
goog.require('got.task');
goog.require('goog.dom');
goog.require('goog.style');
goog.require('goog.events');
goog.require('goog.array');
goog.require('goog.uri.utils');
goog.require('goog.fx.DragListGroup');
goog.require('goog.fx.DragListDirection');
goog.require('goog.dom.forms');
goog.require('goog.dom.classes');

got.app.pc.getProject_ = function() {
  return goog.uri.utils.getPath(location.href).replace(/^\/project\//, '');
};

got.app.pc.getUser_ = function() {
  var res = goog.uri.utils.getPath(location.href).match(/^\/?(.*)\/tasks$/, '');

  return res && res[1];
};

/**
 * Class for PC frontend.
 * @param {String} baseUri
 * @constructor
 */
got.app.PC = function(baseUri) {
  /**
   * @type {got.App}
   * @protected
   */
  this.api_ = new got.Api(baseUri);

  /**
   * Is the cursor on a link.
   * @type {Boolean}
   * @protected
   */
  this.isOnLink_ = false;

  if (goog.dom.getElement('got-public-tasks')) {
    this.loadPublicTasks();
  }
  if (goog.dom.getElement('got-task-list')) {
    this.loadTasks();
  }
  if (goog.dom.getElement('got-project-tasks')) {
    this.loadProjectTasks();
  }
  if (goog.dom.getElement('my-projects')) {
    this.loadMyProjects();
  }
  if (goog.dom.getElement('watch-button')) {
    var element = goog.dom.getElement('watch-button');
    goog.events.listen(element, goog.events.EventType.MOUSEUP, function(e) {
      var isWatch = goog.dom.classes.toggle(element, 'watching');
      element.innerHTML = isWatch ? 'Unwatch' : 'Watch';
      this.api_.watchProject(
        got.app.pc.getProject_(),
        isWatch);
    }, false, this);
  }

  if (goog.dom.getElement('got-post-button')) {
    this.listenPostButton_();
  }
};

/**
 * Load all tasks and render them in the specified element.
 */
got.app.PC.prototype.loadPublicTasks = function() {
  this.api_.allTasks(
    goog.bind(function(tasks) {
      var element = goog.dom.getElement('got-public-tasks');
      element.innerHTML = '';
      goog.array.forEach(tasks, function(task) {
        got.task.render(task, element);
      });
      this.listenTaskAction_(element);
      this.listenCommentEvents_(element);
    }, this));
};

got.app.PC.prototype.loadTasks = function() {
  this.api_.tasks(
    got.app.pc.getUser_(),
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
      this.listenDragEvents_(curEl);
      this.listenCheckEvents_('got-task-list');
    }, this)
  );
};

got.app.PC.prototype.loadProjectTasks = function() {
  this.api_.projectTasks(
    got.app.pc.getProject_(),
    goog.bind(function(tasks) {
      var element = goog.dom.getElement('got-project-tasks');
      element.innerHTML = '';
      goog.array.forEach(tasks, function(task) {
        got.task.render(task, element);
      });
    })
  );
};

got.app.PC.prototype.loadMyProjects = function() {
  this.api_.myProjects(function(projects) {
    var element = goog.dom.getElement('my-projects');
    element.innerHTML = '';
    goog.array.forEach(projects, function(project) {
      var a = goog.dom.createDom('a', {'href': '/project/'+project['project']}, '#'+project['project']);
      if (project['project'] === got.app.pc.getProject_()) {
        a.className = 'current';
      }
      a.appendChild(goog.dom.createDom('div', 'count', ''+project['num']));
      element.appendChild(a);
    });
  });
};

got.app.PC.prototype.onSubmit_ = function(e) {
  var form = e.target;
  var textarea = goog.dom.getElementsByTagNameAndClass('textarea', null, form)[0];
  this.api_.update(goog.dom.forms.getFormDataMap(form).toObject(), function(res) {
    if (goog.dom.getElement('got-public-tasks')) {
      got.task.render(res, 'got-public-tasks');
    }
  });
  textarea.value = '';
};

/**
 * Event handler fired on end of dragging.
 * @param {goog.events.BrowserEvent} e
 * @protected
 */
got.app.PC.prototype.onDragEnd_ = function(e) {
  var taskEls
      = goog.dom.getElementsByClass('got-taskitemline', this.taskListEl_);
  this.api_.sortTasks(goog.array.map(taskEls, function(el) {
    return el['id'];
  }));
};

/**
 * Specify which element is draggable.
 * @param {Element} item
 * @return {Element}
 * @protected
 */
got.app.PC.prototype.getHandlerForDragItem_ = function(item) {
  return goog.dom.getElementByClass('got-taskitem-body', item);
};

/**
 * Listen drag events of tasks.
 * @param {Element|String} element
 * @protected
 */
got.app.PC.prototype.listenDragEvents_ = function(element) {
  element = goog.dom.getElement(element);

  /**
   * @type {goog.fx.DragListGroup}
   * @protected
   */
  var dlg = this.dlg_ = new goog.fx.DragListGroup();

  dlg.addDragList(element,
                  goog.fx.DragListDirection.DOWN);
  dlg.setDragItemHoverClass('cursor-move');
  dlg.setDraggerElClass('cursor-move dragging');
  dlg.setFunctionToGetHandleForDragItem(
    this.getHandlerForDragItem_
  );
  goog.events.listen(dlg, goog.fx.DragListGroup.EventType.DRAGEND,
                     this.onDragEnd_ , false, this);

  // don't drag if the cursor is on a link.
  goog.events.listen(
    dlg, goog.fx.DragListGroup.EventType.BEFOREDRAGSTART,
    function(e) {
      if (this.isOnLink_) {
        e.preventDefault();
      }
    }, false, this);

  dlg.init();
};

/**
 * Event handler fired on check of checkboxes.
 * @param {goog.events.BrowserEvent} e
 * @protected
 */
got.app.PC.prototype.onCheck_ = function(e) {
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
  this.api_.update(
    {'id': taskEl['id'], 'is_done': checkEl.checked}
  );
};

/**
 * Listen click events of checkboxes.
 * @param {Element|String} element
 * @protected
 */
got.app.PC.prototype.listenCheckEvents_ = function(element) {
  element = goog.dom.getElement(element);
  var checkboxes = goog.dom.getElementsByClass('got-taskitem-done', element);
  goog.array.forEach(checkboxes, function(checkEl) {
    goog.events.listen(checkEl, goog.events.EventType.CLICK,
                       this.onCheck_ , false, this);
  }, this);
};

got.app.PC.prototype.listenCommentEvents_ = function(element) {
  element = goog.dom.getElement(element);
  var commentLinkEls = goog.dom.getElementsByClass('task-comment', element);
  goog.array.forEach(commentLinkEls, function(el) {
    var commentFormEl = goog.dom.getElementByClass('got-taskitem-comment', el.parentNode);
    goog.events.listen(el, goog.events.EventType.CLICK, function(e) {
      goog.style.showElement(commentFormEl, true);
      commentFormEl.body.focus();
    });
  });
  var commentFormEls = goog.dom.getElementsByClass('got-taskitem-comment', element);
  goog.array.forEach(commentFormEls, function(el) {
    goog.events.listen(el, goog.events.EventType.SUBMIT, function(e) {
      this.api_.taskComment(goog.dom.forms.getFormDataMap(el).toObject(), function(comment) {
        el.body.value = '';
        goog.style.showElement(el, false);
      });
    }, false, this);
  }, this);
};

/**
 * Event handler fired when the mouse is over tasks.
 * @param {goog.events.BrowserEvent} e
 * @protected
 */
got.app.PC.prototype.onMouseOver_ = function(e) {
  var taskEl = goog.dom.getAncestorByClass(e.target, 'got-taskitem');
  var actionEl = goog.dom.getElementByClass('got-taskitem-action', taskEl);
  if (actionEl) {
    goog.style.showElement(actionEl, true);
  }
};

/**
 * Event handler fired when the mouse goes out of tasks.
 * @param {goog.events.BrowserEvent} e
 * @protected
 */
got.app.PC.prototype.onMouseOut_ = function(e) {
  var taskEl = goog.dom.getAncestorByClass(e.target, 'got-taskitem');
  var actionEl = goog.dom.getElementByClass('got-taskitem-action', taskEl);
  if (actionEl) {
    goog.style.showElement(actionEl, false);
  }
};

/**
 * Listen mouse events of tasks.
 * @param {Element|String} element
 * @protected
 */
got.app.PC.prototype.listenMouseEvents_ = function(element) {
  element = goog.dom.getElement(element);
  goog.events.listen(element, goog.events.EventType.MOUSEOVER,
                     this.onMouseOver_, false, this);
  goog.events.listen(element, goog.events.EventType.MOUSEOUT,
                     this.onMouseOut_, false, this);
};

/**
 * Listen click events on task action (Edit/Delete).
 * @param {Element|String} element
 * @protected
 */
got.app.PC.prototype.listenTaskAction_ = function(element) {
  element = goog.dom.getElement(element);
  var tasks = goog.dom.getElementsByClass('got-taskitem', element);
  goog.array.forEach(tasks, function(task) {
    var actionEl = goog.dom.getElementByClass('got-taskitem-action', task);
    goog.events.listen(
      actionEl.childNodes[0], goog.events.EventType.CLICK,
      function(e) {
        this.api_.copy(task['id'], function(res) {
          got.task.render(res, 'got-public-tasks');
        });
      }, false, this);
    goog.events.listen(
      actionEl.childNodes[1], goog.events.EventType.CLICK,
      function(e) {
        this.api_.move(task['id'], function(res) {
          goog.dom.removeNode(task);
          got.task.render(res, 'got-public-tasks');
        });
      }, false, this);
  }, this);
};

got.app.PC.prototype.listenPostButton_ = function() {
  var button = goog.dom.getElement('got-post-button');
  var form = goog.dom.getElement('got-post-form');
  var textarea = goog.dom.getElementsByTagNameAndClass('textarea', null, form)[0];
  goog.events.listen(button, goog.events.EventType.CLICK, function(e) {
    goog.style.showElement(button, false);
    goog.style.showElement(form, true);
    textarea.focus();
    goog.events.listen(document.body, goog.events.EventType.CLICK,
                       this.blurPostForm_, false, this);
  }, false, this);

  goog.events.listen(goog.dom.getElement('got-post-task'),
                     goog.events.EventType.SUBMIT,
                     this.onSubmit_, false, this);
};

/**
 * @private
 */
got.app.PC.prototype.blurPostForm_ = function(e) {
  var button = goog.dom.getElement('got-post-button');
  var form = goog.dom.getElement('got-post-form');
  var textarea = goog.dom.getElementsByTagNameAndClass('textarea', null, form)[0];
  if (textarea.value === '' &&
      e.target !== button &&
      !goog.dom.getAncestor(e.target, function(el) {
        return el.id === 'got-post-form'; })) {
    goog.style.showElement(form, false);
    goog.style.showElement(button, true);
    goog.events.unlisten(document.body, goog.events.EventType.CLICK,
                         this.blurPostForm_, false, this);
  }
};
