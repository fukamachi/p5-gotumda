package Gotumda::Web::Dispatcher;
use strict;
use warnings;
use Amon2::Web::Dispatcher::Lite;
use Hatena::API::Auth;

get '/' => sub {
    my ($c) = @_;
    $c->render( 'index.tt', { user => $c->current_user } );
};

get '/project/:project' => sub {
    my ($c) = @_;
    $c->render( 'project.tt', { user => $c->current_user } );
};

get '/tasks' => sub {
    my ($c) = @_;
    $c->render( 'tasks.tt', { user => $c->current_user } );
};

any '/auth' => sub {
    my ($c) = @_;
    my $api = Hatena::API::Auth->new( $c->config->{'Hatena::API::Auth'} );

    if ( my $cert = $c->req->param('cert') ) {
        my $user = $api->login($cert)
            or die "Couldn't login: " . $api->errstr;
        $c->current_user($user);

        $c->db->find_or_create(
            user => +{
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
    my $iter = $c->db->search(
        task => {},
        { order_by => { created_at => 'DESC' } },
    );

    return $c->render_json( [ map { $_->to_hashref } $iter->all ] );
};

post '/api/update.json' => sub {
    my ($c) = @_;
    my $user = $c->current_user;
    $c->redirect('/auth') unless $user;

    my $task = $c->db->insert(
        task => {
            body       => $c->req->param('body'),
            user_name  => $user->name,              # TODO
            owner_name => $user->name,              # TODO
        }
    );

    return $c->render_json( $task->to_hashref );
};

1;
