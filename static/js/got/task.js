// Copyright 2011 Eitarow Fukamachi. All rights reserved.

/**
 * @fileoverview Class for Task.
 *
 * @author e.arrows@gmail.com (Eitarow Fukamachi)
 */

goog.provide('got.task');

goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.json');
goog.require('goog.object');
goog.require('goog.string');
goog.require('got.Api');
goog.require('got.tmpl.task');


/**
 * Render this task into the specified element.
 * @param {Object} task JSON object of task.
 * @param {Element|String} element Where to render.
 */
got.task.render = function(task, element) {
  /**
   * @type {Element}
   * @protected
   */
  element = goog.dom.getElement(element);

  goog.object.extend(
      task,
      {
        'body': got.task.parseBody_(task['body']),
        'is_logined': got.IS_LOGINED
      });

  var taskEl = goog.dom.htmlToDocumentFragment(got.tmpl.task.render(task));

  goog.dom.insertChildAt(element, taskEl, 0);

  got.task.listenTaskAction_(taskEl);
  got.task.listenCommentEvents_(taskEl);
};


/**
 * Render a task with one-line style.
 * @param {Object} task JSON object of task.
 * @param {Element|String} element Where to render.
 */
got.task.renderLine = function(task, element) {
  element = goog.dom.getElement(element);

  goog.object.extend(task, {'is_logined': got.IS_LOGINED});

  var taskEl = goog.dom.htmlToDocumentFragment(got.tmpl.task.renderLine(task));

  goog.dom.insertChildAt(element, taskEl, 0);
};


/**
 * Convert a task body into HTML.
 * @param {String} body Raw task body.
 * @private
 * @return {String} Converted body.
 */
got.task.parseBody_ = function(body) {
  return goog.string.htmlEscape(body)
      .replace(/#(\w+)/, '<a href="/project/$1">#$1</a>')
      .replace(/@(\w+)/, '<a href="/$1/tasks">@$1</a>');
};


/**
 * Listen click events on task action (Edit/Delete).
 * @param {Element} element Element of a task.
 * @private
 */
got.task.listenTaskAction_ = function(element) {
  var actionEl = goog.dom.getElementByClass('got-taskitem-action', element);
  var api = new got.Api();
  goog.events.listen(
      actionEl.childNodes[0], goog.events.EventType.CLICK,
      function(e) {
        api.copy(element['id'], function(res) {
          got.task.render(res, 'got-public-tasks');
        });
      });
  goog.events.listen(
      actionEl.childNodes[1], goog.events.EventType.CLICK,
      function(e) {
        api.move(element['id'], function(res) {
          goog.dom.removeNode(element);
          got.task.render(res, 'got-public-tasks');
        });
      });
};


/**
 * @param {Element} element Element of a task.
 * @private
 */
got.task.listenCommentEvents_ = function(element) {
  var commentEl =
      goog.dom.getElementByClass('task-comment', element);
  var commentFormEl =
      goog.dom.getElementByClass('comment-form', element);

  goog.events.listen(commentEl, goog.events.EventType.CLICK, function(e) {
    goog.style.showElement(commentFormEl, true);
    commentFormEl.body.focus();
  });

  goog.events.listen(commentFormEl, goog.events.EventType.SUBMIT, function(e) {
    var api = new got.Api();
    api.taskComment(
        goog.dom.forms.getFormDataMap(el).toObject(), function(comment) {
          commentFormEl.body.value = '';
          goog.style.showElement(el, false);
        });
  });
};
