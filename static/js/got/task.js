// Copyright 2011 Eitarow Fukamachi. All rights reserved.

/**
 * @fileoverview Class for Task.
 *
 * @author e.arrows@gmail.com (Eitarow Fukamachi)
 */

goog.provide('got.task');

goog.require('goog.dom');
goog.require('goog.json');
goog.require('goog.array');
goog.require('got.tmpl.task');

/**
 * Render this task into the specified element.
 * @param {Object} task
 * @param {Element|String} element Where to render.
 */
got.task.render = function(task, element) {
  /**
   * @type {Element}
   * @protected
   */
  element = goog.dom.getElement(element);

  var taskHtml = got.tmpl.task.render(
    {'id': task['id'],
     'user_name': task['user']['name'],
     'owner_name': task['owner']['name'],
     'body': task['body'],
     'owner_image_url': task['owner']['image_url'],
     'user_thumbnail_url': task['user']['thumbnail_url']}
  );

  element.innerHTML = taskHtml + element.innerHTML;
};

got.task.renderLine = function(task, element) {
  element = goog.dom.getElement(element);

  var taskHtml = got.tmpl.renderLine(
    {'id': task['id'],
     'is_done': task['is_done'],
     'user_thumbnail_url': task['user']['thumbnail_url']}
  );

  element.innerHTML = taskHtml + element.innerHTML;
};
