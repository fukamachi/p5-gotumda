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
goog.require('got.app.pc');
goog.require('got.tmpl.task');


/**
 * Render this task into the specified element.
 * @param {Object} task JSON object of task.
 * @param {Element|String} opt_element Where to render.
 * @return {Element} New task element.
 */
got.task.render = function(task, opt_element) {
  goog.object.extend(
      task,
      {
        'body': got.task.parseBody_(task['body']),
        'login_user': got.LOGIN_USER
      });

  var taskEl = goog.dom.htmlToDocumentFragment(got.tmpl.task.render(task));

  if (opt_element) {
    var element = goog.dom.getElement(opt_element);
    goog.dom.insertChildAt(element, taskEl, 0);
  }

  got.task.listenEvents_(taskEl);

  return taskEl;
};


/**
 * Render a task with one-line style.
 * @param {Object} task JSON object of task.
 * @param {Element|String} element Where to render.
 */
got.task.renderLine = function(task, element) {
  element = goog.dom.getElement(element);

  goog.object.extend(task, {'login_user': got.LOGIN_USER});

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
 * @param {Element} element Element of a task.
 * @private
 */
got.task.listenEvents_ = function(element) {
  got.task.listenTaskAction_(element);
  got.task.listenEditEvents_(element);
  got.task.listenDeleteEvents_(element);
  got.task.listenCommentEvents_(element);
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
  var copyEl = goog.dom.getElementByClass('action-copy', actionEl);
  if (copyEl) {
    goog.events.listen(
        copyEl, goog.events.EventType.CLICK,
        function(e) {
          if (confirm(copyEl.title)) {
            api.copy(element['id'], got.app.pc.onAfterCreate);
          }
        });
  }
  // Get button.
  var getEl = goog.dom.getElementByClass('action-get', actionEl);
  if (getEl) {
    goog.events.listen(
        getEl, goog.events.EventType.CLICK,
        function(e) {
          if (confirm(getEl.title)) {
            api.move(element['id'], function(res) {
              var taskEl = got.task.render(res);
              goog.dom.replaceNode(taskEl, element);
              got.app.pc.instance.refreshMyTasksCount();
            });
          }
        });
  }
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

  if (linkEl) {
    goog.events.listen(linkEl, goog.events.EventType.CLICK, function(e) {
      goog.style.showElement(formEl, true);
      formEl.body.focus();
    });
  }

  if (formEl) {
    goog.events.listen(formEl, goog.events.EventType.SUBMIT, function(e) {
      var api = new got.Api();
      api.taskComment(
          goog.dom.forms.getFormDataMap(formEl).toObject(), function(comment) {
            formEl.body.value = '';
            got.task.renderComment(comment, element);
          });
    });
  }
};


/**
 * @param {Element} element Element of a task.
 * @private
 */
got.task.listenDeleteEvents_ = function(element) {
  var linkEl =
      goog.dom.getElementByClass('task-delete', element);
  if (linkEl) {
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
  }
};


/**
 * @param {Element} element Element of a task.
 * @private
 */
got.task.listenEditEvents_ = function(element) {
  var editEl = goog.dom.getElementByClass('task-edit', element);
  if (editEl) {
    goog.events.listen(editEl, goog.events.EventType.CLICK, function(e) {
      got.task.toggleEditting_(element, true);
    });
  }
  var cancelEl = goog.dom.getElementByClass('task-cancel', element);
  if (cancelEl) {
    goog.events.listen(cancelEl, goog.events.EventType.CLICK, function(e) {
      got.task.toggleEditting_(element, false);
    });
  }
  var saveEl = goog.dom.getElementByClass('task-save', element);
  if (saveEl) {
    goog.events.listen(saveEl, goog.events.EventType.CLICK, function(e) {
      got.task.saveEditting_(element);
    });
  }
};


/**
 * @param {Element} element Element of a task.
 * @param {?Boolean} opt_isStart Flag if start or end.
 * @private
 */
got.task.toggleEditting_ = function(element, opt_isStart) {
  var mainEl = goog.dom.getElementByClass('got-taskitem-main', element);
  var bodyEl = goog.dom.getElementByClass('got-taskitem-body', mainEl);
  var mainEditEl =
      goog.dom.getElementByClass('got-taskitem-main-edit', element);
  var editBodyEl =
      goog.dom.getElementsByTagNameAndClass('textarea', null, mainEditEl)[0];
  editBodyEl.value = goog.dom.getTextContent(bodyEl);
  goog.style.showElement(mainEl, !opt_isStart);
  goog.style.showElement(mainEditEl, opt_isStart);
  if (opt_isStart) {
    editBodyEl.focus();
  }
};


/**
 * @param {Element} element Element of a task.
 * @private
 */
got.task.saveEditting_ = function(element) {
  var mainEl = goog.dom.getElementByClass('got-taskitem-main', element);
  var mainEditEl =
      goog.dom.getElementByClass('got-taskitem-main-edit', element);
  var editBodyEl =
      goog.dom.getElementsByTagNameAndClass('textarea', null, mainEditEl)[0];
  var api = new got.Api();
  api.update({'id': element['id'], 'body': editBodyEl.value},
             got.app.pc.onAfterCreate);
  goog.dom.removeNode(element);
  got.app.pc.instance.refreshMyTasksCount();
};
