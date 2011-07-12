// Copyright 2011 Eitarow Fukamachi. All rights reserved.

/**
 * @fileoverview JavaScript used in PC browser.
 *
 * @author e.arrows@gmail.com (Eitarow Fukamachi)
 */


goog.provide('got.app.PC');
goog.provide('got.app.pc');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.events');
goog.require('goog.style');
goog.require('goog.uri.utils');
goog.require('got.Api');
goog.require('got.task');


/**
 * @type {got.app.PC}
 */
got.app.pc.instance = null;


/**
 * @param {Object} task JSON of a new task.
 */
got.app.pc.onAfterCreate = function(task) {
  (goog.bind(
      got.app.pc.instance.onAfterCreate,
      got.app.pc.instance))(task);
};



/**
 * Class for PC frontend.
 * @param {String} opt_baseUri Base URI to pass to {got.Api}.
 * @constructor
 */
got.app.PC = function(opt_baseUri) {
  /**
   * @type {got.App}
   * @protected
   */
  this.api = new got.Api(opt_baseUri);

  if (goog.dom.getElement('watch-projects')) {
    this.loadWatchProjects();
  }

  if (goog.dom.getElement('got-post-button')) {
    this.listenPostButton();
  }

  got.app.pc.instance = this;
};


/**
 * @protected
 */
got.app.PC.prototype.loadWatchProjects = function() {
  this.api.watchProjects(function(projects) {
    var element = goog.dom.getElement('watch-projects');
    element.innerHTML = '';
    goog.array.forEach(projects, function(project) {
      var a =
          goog.dom.createDom(
              'a',
              { 'href': '/project/' + project['project'] },
              '#' + project['project']);

      if (('/project/' + project['project']) ===
          goog.uri.utils.getPath(location.href)) {
        a.className = 'current';
      }
      a.appendChild(goog.dom.createDom('div', 'count', '' + project['num']));
      element.appendChild(a);
    });
  });
};


/**
 * Refresh a count of My Tasks.
 */
got.app.PC.prototype.refreshMyTasksCount = function() {
  var myTasksNav =
      goog.dom.getElementByClass(
          'my-tasks', goog.dom.getElement('content-left'));
  var count = goog.dom.getElementByClass('count', myTasksNav);
  this.api.taskCount(null, function(num) { count.innerHTML = num; });
};


/**
 * @param {Object} task JSON of a new task.
 */
got.app.PC.prototype.onAfterCreate = function(task) {
  if (task['owner']['name'] === got.LOGIN_USER) {
    this.refreshMyTasksCount();
  }
  this.loadWatchProjects();
};


/**
 * Event handler fired on submit a form to create a new task.
 * @param {goog.events.BrowserEvent} e Event object.
 * @private
 */
got.app.PC.prototype.onSubmit_ = function(e) {
  var form = e.target;
  var textarea =
      goog.dom.getElementsByTagNameAndClass('textarea', null, form)[0];
  this.api.update(
      goog.dom.forms.getFormDataMap(form).toObject(),
      got.app.pc.onAfterCreate);
  textarea.value = '';
};


/**
 * @protected
 */
got.app.PC.prototype.listenPostButton = function() {
  var button = goog.dom.getElement('got-post-button');
  var form = goog.dom.getElement('got-post-form');
  var textarea =
      goog.dom.getElementsByTagNameAndClass('textarea', null, form)[0];
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
 * @param {goog.events.BrowserEvent} e Event object.
 * @private
 */
got.app.PC.prototype.blurPostForm_ = function(e) {
  var button = goog.dom.getElement('got-post-button');
  var form = goog.dom.getElement('got-post-form');
  var textarea =
      goog.dom.getElementsByTagNameAndClass('textarea', null, form)[0];
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
