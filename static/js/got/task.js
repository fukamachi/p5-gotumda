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
  got.task.listenDeleteEvents_(taskEl);
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
 * @param {Object} comment JSON of a task comment.
 * @param {Element} element Element of a task.
 */
got.task.renderComment = function(comment, element) {
  var formEl =
      goog.dom.getElementByClass('comment-form', element);
  var commentEl =
      goog.dom.htmlToDocumentFragment(got.tmpl.task.renderTaskComment(comment));

  goog.dom.insertSiblingBefore(commentEl, formEl);
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
      .replace(/@(\w+)/, '<a href="/tasks/$1">@$1</a>');
};


/**
 * Listen click events on task action (Edit/Delete).
 * @param {Element} element Element of a task.
 * @private
 */
got.task.listenTaskAction_ = function(element) {
  var actionEl = goog.dom.getElementByClass('got-taskitem-action', element);
  var api = new got.Api();
  // Copy button.
  var copyEl = actionEl.childNodes[0];
  goog.events.listen(
      copyEl, goog.events.EventType.CLICK,
      function(e) {
        if (confirm(copyEl.title)) {
          api.copy(element['id'], function(res) {
            got.task.render(res, 'got-public-tasks');
          });
        }
      });
  // Get button.
  var getEl = actionEl.childNodes[1];
  goog.events.listen(
      getEl, goog.events.EventType.CLICK,
      function(e) {
        if (confirm(getEl.title)) {
          api.move(element['id'], function(res) {
            goog.dom.removeNode(element);
            got.task.render(res, 'got-public-tasks');
          });
        }
      });
};


/**
 * @param {Element} element Element of a task.
 * @private
 */
got.task.listenCommentEvents_ = function(element) {
  var linkEl =
      goog.dom.getElementByClass('task-comment', element);
  var formEl =
      goog.dom.getElementByClass('comment-form', element);

  goog.events.listen(linkEl, goog.events.EventType.CLICK, function(e) {
    goog.style.showElement(formEl, true);
    formEl.body.focus();
  });

  goog.events.listen(formEl, goog.events.EventType.SUBMIT, function(e) {
    var api = new got.Api();
    api.taskComment(
        goog.dom.forms.getFormDataMap(formEl).toObject(), function(comment) {
          formEl.body.value = '';
          got.task.renderComment(comment, element);
        });
  });
};


/**
 * @param {Element} element Element of a task.
 * @private
 */
got.task.listenDeleteEvents_ = function(element) {
  var linkEl =
      goog.dom.getElementByClass('task-delete', element);
  var bodyEl =
      goog.dom.getElementByClass('got-taskitem-body', element);
  goog.events.listen(linkEl, goog.events.EventType.CLICK, function(e) {
    var api = new got.Api();
    if (confirm('Are you sure you want to permanently delete "' +
                goog.dom.getTextContent(bodyEl) + '"?')) {
      api.destroy(element['id'], function() {
        goog.dom.removeNode(element);
      });
    }
  });
};
