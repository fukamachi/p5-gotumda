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
goog.require('goog.string');
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

  var taskHtml = got.tmpl.task.render(
      {
        'id': task['id'],
        'user_name': task['user']['name'],
        'owner_name': task['owner']['name'],
        'body': got.task.parseBody_(task['body']),
        'is_done': task['is_done'],
        'owner_image_url': task['owner']['image_url'],
        'user_thumbnail_url': task['user']['thumbnail_url'],
        'is_logined': got.IS_LOGINED
      });

  element.innerHTML = taskHtml + element.innerHTML;
};


/**
 * Render a task with one-line style.
 * @param {Object} task JSON object of task.
 * @param {Element|String} element Where to render.
 */
got.task.renderLine = function(task, element) {
  element = goog.dom.getElement(element);

  var taskHtml = got.tmpl.task.renderLine(
      {
        'id': task['id'],
        'body': task['body'],
        'is_done': task['is_done'],
        'user_thumbnail_url': task['user']['thumbnail_url'],
        'is_logined': got.IS_LOGINED
      });

  element.innerHTML = taskHtml + element.innerHTML;
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
