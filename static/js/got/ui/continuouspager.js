// Copyright 2011 Eitarow Fukamachi. All rights reserved.

/**
 * @fileoverview Continuous paging component.
 *
 * @author e.arrows@gmail.com (Eitarow Fukamachi)
 */


goog.provide('got.ui.ContinuousPager');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.ui.Component');
goog.require('got.Api');
goog.require('got.task');



/**
 * @param {Function(Array.<Object>)} opt_callback Callback function.
 * @constructor
 * @extends {goog.ui.Component}
 */
got.ui.ContinuousPager = function(opt_callback) {
  /**
   * @type {got.Api}
   * @protected
   */
  this.api = new got.Api();

  /**
   * @type {Integer}
   * @protected
   */
  this.page = 0;

  /**
   * @type {Function(Array.<Object>)}
   * @private
   */
  this.callback_ = opt_callback || goog.nullFunction;
};
goog.inherits(got.ui.ContinuousPager, goog.ui.Component);


/**
 * Event handler fired when clicked this pager.
 * @param {goog.events.BrowserEvent} e Event when clicked.
 */
got.ui.ContinuousPager.prototype.onClick = function(e) {
  this.api.allTasks(goog.bind(function(tasks) {
    var el = this.element_.parentNode;
    this.disposeInternal();
    if (tasks.length > 0) {
      this.callback_(tasks);
      this.render(el);
    }
  }, this), ++this.page);
};


/**
 * @override
 */
got.ui.ContinuousPager.prototype.createDom = function() {
  var el = goog.dom.createDom('a', 'got-cont-pager', 'Older Tasks');
  goog.events.listen(el, goog.events.EventType.CLICK,
                     this.onClick, false, this);
  this.setElementInternal(el);
};
