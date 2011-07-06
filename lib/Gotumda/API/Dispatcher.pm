package Gotumda::API::Dispatcher;
use strict;
use warnings;
use Amon2::Web::Dispatcher::Lite;

get '/all-tasks.json' => sub {
    my ($c) = @_;
    my $iter = $c->db->search(
        task => {},
        { order_by => { created_at => 'ASC' } },
    );

    return $c->render_json( [ map { $_->to_hashref } $iter->all ] );
};

post '/update.json' => sub {
    my ($c) = @_;

    return $c->redirect('/auth') unless $c->current_user;

    my $task = $c->db->insert(
        task => {
            body       => $c->req->param('body'),
            user_name  => $c->current_user->name,
            owner_name => $c->current_user->name,
        }
    );

    return $c->render_json( $task->to_hashref );
};

get '/my-tasks.json' => sub {
    my ($c) = @_;

    return $c->bad_request('Authorization required.') unless $c->current_user;

    my @tasks
        = $c->db->search( task => { owner_name => $c->current_user->name } )
        ->all;

    my $order = $c->db->find_or_create(
        sort_order => { user_name => $c->current_user->name } );

    return $c->render_json(
        [ map { $_->to_hashref } $order->sort_tasks( \@tasks ) ] );
};

post '/destroy.json' => sub {
    my ($c) = @_;

    return $c->bad_request('Authorization required.')
        unless $c->current_user;

    die("'id' is a required parameter.") unless $c->req->param('id');
    $c->db->delete( task => { id => $c->req->param('id') } );
};

post '/move.json' => sub {
    my ($c) = @_;

    return $c->bad_request('Authorization required.')
        unless $c->current_user;

    die("'id' is a required parameter.") unless $c->req->param('id');
    my $task = $c->db->single( task => { id => $c->req->param('id') } );
    $task->update( { owner_name => $c->current_user->name } );

    return $c->render_json( $task->to_hashref );
};

post '/copy.json' => sub {
    my ($c) = @_;

    return $c->bad_request('Authorization required.')
        unless $c->current_user;

    die("'id' is a required parameter.") unless $c->req->param('id');
    my $task = $c->db->single( task => { id => $c->req->param('id') } );

    my $new_task = $c->db->insert(
        task => {
            body           => $task->body,
            user_name      => $c->current_user->name,
            owner_name     => $c->current_user->name,
            origin_task_id => $task->id,
            is_done        => $task->is_done,
        }
    );

    return $c->render_json( $new_task->to_hashref );
};

post '/sort-tasks.json' => sub {
    my ($c) = @_;

    return $c->bad_request('Authorization required.')
        unless $c->current_user;

    my $order = $c->db->find_or_create(
        sort_order => { user_name => $c->current_user->name } );

    $order->update( { sort_order => $c->req->param('sort_order') } );

    return $c->no_content;
};

get '/my-projects.json' => sub {
    my ($c) = @_;

    return $c->bad_request('Authorization required.')
        unless $c->current_user;

    my $iter = $c->db->search(
        watch_project => { user_name => $c->current_user->name } );

    return $c->render_json( [ map { $_->to_hashref } $iter->all ] );
};

get '/project.json' => sub {
    my ($c)     = @_;
    my $project = $c->req->param('project');
    my $iter    = $c->db->search_named(
        'SELECT task.* FROM task_project
         JOIN task ON task.id = task_project.task_id
         WHERE task_project.project = :project
         ORDER BY task.created_at ASC',
        { project => $project },
        'task'
    );

    return $c->render_json( [ map { $_->to_hashref } $iter->all ] );
};

post '/watch-project.json' => sub {
    my ($c) = @_;

    return $c->bad_request('Authorization required.')
        unless $c->current_user;

    my $meth
        = $c->req->param('is_watch') eq 'true'
        ? 'find_or_create'
        : 'delete';

    $c->db->$meth(
        watch_project => {
            user_name => $c->current_user->name,
            project   => $c->req->param('project')
        }
    );

    return $c->no_content;
};

1;
