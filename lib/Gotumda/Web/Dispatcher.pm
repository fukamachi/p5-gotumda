package Gotumda::Web::Dispatcher;
use strict;
use warnings;
use Amon2::Web::Dispatcher::Lite;
use Hatena::API::Auth;

get '/' => sub {
    my ($c) = @_;
    $c->render( 'index.tt', { user => $c->user } );
};

get '/project/:project' => sub {
    my ($c) = @_;
    $c->render( 'project.tt', { user => $c->user } );
};

get '/tasks' => sub {
    my ($c) = @_;
    $c->render( 'tasks.tt', { user => $c->user } );
};

any '/auth' => sub {
    my ($c) = @_;
    my $api = Hatena::API::Auth->new( $c->config->{'Hatena::API::Auth'} );

    if ( my $cert = $c->req->param('cert') ) {
        my $user = $api->login($cert)
            or die "Couldn't login: " . $api->errstr;
        $c->user($user);

        $c->dbh->insert(
            user => {
                name          => $user->name,
                image_url     => $user->image_url,
                thumbnail_url => $user->thumbnail_url,
            }
        );

        return $c->redirect('/');
    }

    return $c->redirect( $api->uri_to_login->as_string );
};

get '/api/all-tasks.json' => sub {
    my ($c) = @_;
    my $results
        = $c->dbh->selectall_arrayref(
        'SELECT id, body, is_done, origin_task_id, user_name FROM task',
        { Slice => {} } );

    for (@$results) {
        $_->{user} = $_->{owner} = $c->get_user( $_->{user_name} );
        delete $_->{user_name};
    }

    return $c->render_json($results);
};

post '/api/update.json' => sub {
    my ($c) = @_;
    my $user = $c->user;
    $c->redirect('/auth') unless $user;

    $c->dbh->insert(
        task => {
            body       => $c->req->param('body'),
            user_name  => $user->name,              # TODO
            owner_name => $user->name,              # TODO
        }
    );
    my $task_id = $c->dbh->last_insert_id( undef, undef, qw(task id) );

    my $task
        = $c->dbh->selectrow_hashref(
        'SELECT id, body, is_done, origin_task_id FROM task WHERE id = ?',
        {}, $task_id );
    $task->{user} = $task->{owner} = +{
        name          => $user->name,
        image_url     => $user->image_url,
        thumbnail_url => $user->thumbnail_url,
    };

    return $c->render_json($task);
};

1;
