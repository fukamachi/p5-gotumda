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
 * Class for PC frontend.
 * @param {String} opt_baseUri
 * @constructor
 */
got.app.PC = function(opt_baseUri) {
  /**
   * @type {got.App}
   * @protected
   */
  this.api = new got.Api(opt_baseUri);

  if (goog.dom.getElement('my-projects')) {
    this.loadMyProjects();
  }

  if (goog.dom.getElement('got-post-button')) {
    this.listenPostButton();
  }
};


/**
 * @protected
 */
got.app.PC.prototype.loadMyProjects = function() {
  this.api.myProjects(function(projects) {
    var element = goog.dom.getElement('my-projects');
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
 * @private
 */
got.app.PC.prototype.onSubmit_ = function(e) {
  var form = e.target;
  var textarea =
      goog.dom.getElementsByTagNameAndClass('textarea', null, form)[0];
  this.api.update(
      goog.dom.forms.getFormDataMap(form).toObject(), function(res) {
        if (goog.dom.getElement('got-public-tasks')) {
          got.task.render(res, 'got-public-tasks');
        }
      });
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
