package Gotumda::API::Dispatcher;
use strict;
use warnings;
use Amon2::Web::Dispatcher::Lite;

get '/all-tasks.json' => sub {
    my ($c) = @_;
    my $iter = $c->db->search(
        task => {},
        { order_by => { updated_at => 'ASC' } },
    );

    return $c->render_json( [ map { $_->to_hashref } $iter->all ] );
};

post '/update.json' => sub {
    my ($c) = @_;

    my $task;

    # modifies an exist task.
    if ( $c->req->param('id') ) {
        $task = $c->db->single( task => { id => $c->req->param('id') } );

        # error
        return $c->bad_request('Invalid task.') unless $task;
        return $c->permission_denied unless $task->has_permission;

        my %params;
        $params{id} = $c->req->param('id');
        $params{body} = $c->req->param('body') if $c->req->param('body');
        if ( $c->req->param('is_done') eq 'true' ) {
            $params{is_done} = 1;
        }
        elsif ( $c->req->param('is_done') eq 'false' ) {
            $params{is_done} = undef;
        }

        $task->update( \%params );
    }

    # insert a new task.
    else {
        $task = $c->db->insert(
            task => {
                body       => $c->req->param('body'),
                user_name  => $c->current_user->name,
                owner_name => $c->current_user->name,
                is_done    => $c->req->param('is_done'),
            }
        );
    }

    return $c->render_json( $task->to_hashref );
};

get '/tasks.json' => sub {
    my ($c) = @_;

    my $user_name = $c->req->param('user');

    unless ($user_name) {
        return $c->auth_required unless $c->current_user;
        $user_name = $c->current_user->name;
    }

    my @tasks = $c->db->search( task => { owner_name => $user_name } )->all;

    return $c->render_json( [] ) unless @tasks;

    my $order = $c->db->single( sort_order => { user_name => $user_name } );

    return $c->render_json(
        [   map { $_->to_hashref() }
                $order ? $order->sort_tasks( \@tasks ) : @tasks
        ]
    );
};

post '/destroy.json' => sub {
    my ($c) = @_;

    my $task = $c->db->single( task => { id => $c->req->param('id') } );

    # error
    return $c->bad_request("Invalid task.") unless $task;
    return $c->permission_denied unless $task->has_permission;

    $c->db->delete( task => { id => $c->req->param('id') } );

    return $c->no_content;
};

post '/move.json' => sub {
    my ($c) = @_;

    my $task = $c->db->single( task => { id => $c->req->param('id') } );

    # error
    return $c->bad_request("Invalid task.") unless $task;
    return $c->permission_denied unless $task->has_permission;

    $task->update( { owner_name => $c->current_user->name } );

    return $c->render_json( $task->to_hashref );
};

post '/copy.json' => sub {
    my ($c) = @_;

    my $task = $c->db->single( task => { id => $c->req->param('id') } );

    # error
    $c->bad_request('Invalid task.') unless $task;

    my $new_task = $task->copy();

    return $c->render_json( $new_task->to_hashref );
};

post '/sort-tasks.json' => sub {
    my ($c) = @_;

    my $order = $c->db->find_or_create(
        sort_order => { user_name => $c->current_user->name } );

    $order->update( { sort_order => $c->req->param('sort_order') } );

    return $c->no_content;
};

get '/watch-projects.json' => sub {
    my ($c) = @_;

    return $c->auth_required unless $c->current_user;

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

post '/task-comment.json' => sub {
    my ($c) = @_;

    my $comment = $c->db->insert(
        task_comment => {
            task_id   => $c->req->param('task_id'),
            body      => $c->req->param('body'),
            user_name => $c->current_user->name,
        }
    );

    return $c->render_json( $comment->to_hashref );
};

1;
