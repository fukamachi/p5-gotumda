// This file was automatically generated from task.soy.
// Please don't edit this file by hand.

goog.provide('got.tmpl.task');

goog.require('soy');
goog.require('soy.StringBuilder');


got.tmpl.task.render = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '" class="got-taskitem', (opt_data.is_done) ? ' done-task' : '', '"><div class="profile-image"><a href="/', soy.$$escapeHtml(opt_data.owner.name), '/tasks"><img class="got-taskitem-owner" src="', soy.$$escapeHtml(opt_data.owner.image_url), '" /></a>', (opt_data.owner.name != opt_data.user.name) ? '<a href="/' + soy.$$escapeHtml(opt_data.user.name) + '/tasks"><img class="got-taskitem-user" src="' + soy.$$escapeHtml(opt_data.user.thumbnail_url) + '" /></a>' : '', '</div><div class="got-taskitem-content"><div class="got-taskitem-owner">', (opt_data.owner.name != opt_data.user.name) ? '<a href="/' + soy.$$escapeHtml(opt_data.user.name) + '/tasks">' + soy.$$escapeHtml(opt_data.user.name) + '</a> =>' : '', '<a href="/', soy.$$escapeHtml(opt_data.owner.name), '/tasks">', soy.$$escapeHtml(opt_data.owner.name), '</a></div><div class="got-taskitem-body">', opt_data.body, '</div>', (opt_data.is_logined) ? '<div class="got-taskitem-manage"><a class="task-edit">Edit</a><a class="task-delete">Delete</a><a class="task-comment">Comment</a></div>' : '', '<div class="got-taskitem-comments">');
  var cmtList41 = opt_data.comments;
  var cmtListLen41 = cmtList41.length;
  for (var cmtIndex41 = 0; cmtIndex41 < cmtListLen41; cmtIndex41++) {
    var cmtData41 = cmtList41[cmtIndex41];
    got.tmpl.task.renderTaskComment(cmtData41, output);
  }
  output.append('<form class="comment-form" onsubmit="return false;" style="display: none;"><input type="hidden" name="task_id" value="', soy.$$escapeHtml(opt_data.id), '" /><input type="text" name="body" /></form></div></div>', (opt_data.is_logined) ? '<div class="got-taskitem-action"><a class="button" title="Copy this task and put it into \'My Tasks\'."><img src="/static/img/copy.png" alt="Copy" /></a><a class="button" title="Get and move this task to \'My Tasks\'."><img src="/static/img/get.png" alt="Get" /></a></div>' : '', '</div>');
  if (!opt_sb) return output.toString();
};


got.tmpl.task.renderLine = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div id="', soy.$$escapeHtml(opt_data.id), '" class="got-taskitemline">', (opt_data.is_logined) ? '<input class="got-taskitem-done" type="checkbox"' + ((opt_data.is_done) ? ' checked="true"' : '') + ' />' : '', '<div class="got-taskitem-body"><img src="', soy.$$escapeHtml(opt_data.user.thumbnail_url), '" />', soy.$$escapeHtml(opt_data.body), '</div></div>');
  if (!opt_sb) return output.toString();
};


got.tmpl.task.renderTaskComment = function(opt_data, opt_sb) {
  var output = opt_sb || new soy.StringBuilder();
  output.append('<div class="got-taskitem-comment"><img src="', soy.$$escapeHtml(opt_data.user.thumbnail_url), '" alt="', soy.$$escapeHtml(opt_data.user.name), '" title="', soy.$$escapeHtml(opt_data.user.name), '" /> ', soy.$$escapeHtml(opt_data.body), '</div>');
  if (!opt_sb) return output.toString();
};
