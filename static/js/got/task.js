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

  var checkEl = goog.dom.createDom('input',
                                   {'class': 'got-taskitem-done',
                                    'type': 'checkbox'});
  if (task['is_done']) {
    checkEl.checked = true;
  }

  var taskEl = goog.dom.createDom(
    'div', 'got-taskitemline',
    checkEl,
    goog.dom.createDom(
      'div', 'got-taskitem-body',
      goog.dom.createDom(
        'img', {'src': task['user']['thumbnail_url']}),
      task['body']
    )
  );

  taskEl['id'] = task['id'];

  goog.dom.insertChildAt(element, taskEl, 0);
};
