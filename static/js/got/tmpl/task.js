// This file was automatically generated from task.soy.
// Please don't edit this file by hand.

goog.provide('got.tmpl.task');

goog.require('soy');
goog.require('soy.StringBuilder');


got.tmpl.task.render = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '" class="got-taskitem', (opt_data.is_done) ? ' done-task' : '', '"><div class="profile-image"><a href="/', soy.$$escapeHtml(opt_data.owner_name), '/tasks"><img class="got-taskitem-owner" src="', soy.$$escapeHtml(opt_data.owner_image_url), '" /></a>', (opt_data.owner_name != opt_data.user_name) ? '<a href="/' + soy.$$escapeHtml(opt_data.user_name) + '/tasks"><img class="got-taskitem-user" src="' + soy.$$escapeHtml(opt_data.user_thumbnail_url) + '" /></a>' : '', '</div><div class="got-taskitem-content"><div class="got-taskitem-owner">', (opt_data.owner_name != opt_data.user_name) ? '<a href="/' + soy.$$escapeHtml(opt_data.user_name) + '/tasks">' + soy.$$escapeHtml(opt_data.user_name) + '</a> =>' : '', '<a href="/', soy.$$escapeHtml(opt_data.owner_name), '/tasks">', soy.$$escapeHtml(opt_data.owner_name), '</a></div><div class="got-taskitem-body">', opt_data.body, '</div><div class="got-taskitem-manage"><a class="task-edit">Edit</a><a class="task-delete">Delete</a><a class="task-comment">Comment</a><form class="got-taskitem-comment" onsubmit="return false;" style="display: none;"><input type="hidden" name="task_id" value="', soy.$$escapeHtml(opt_data.id), '" /><input type="text" name="body" /></form></div></div><div class="got-taskitem-action"><a class="button"><img src="/static/img/copy.png" /></a><a class="button"><img src="/static/img/get.png" /></a></div></div>');
  if (!opt_sb) return output.toString();
};


got.tmpl.task.renderLine = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '" class="got-taskitemline"><input class="got-taskitem-done" type="checkbox"', (opt_data.is_done) ? ' checked="true"' : '', ' /><div class="got-taskitem-body"><img src="', soy.$$escapeHtml(opt_data.user_thumbnail_url), '" />', soy.$$escapeHtml(opt_data.body), '</div></div>');
  if (!opt_sb) return output.toString();
};
