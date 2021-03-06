package Gotumda::Web::Dispatcher;
use strict;
use warnings;
use Amon2::Web::Dispatcher::Lite;
use Hatena::API::Auth;

get '/' => sub {
    my ($c) = @_;
    $c->render('index.tt');
};

get '/project/{project}' => sub {
    my ( $c, $args ) = @_;

    return $c->render(
        'project.tt',
        {   project  => $args->{'project'},
            watching => !!(
                $c->current_user && $c->db->single(
                    watch_project => {
                        user_name => $c->current_user->name,
                        project   => $args->{'project'}
                    }
                )
            )
        }
    );
};

get '/tasks/{user}' => sub {
    my ( $c, $args ) = @_;

    if (    $c->current_user
        and $c->current_user->name eq $args->{user} )
    {
        return $c->redirect('/tasks');
    }

    $c->render( 'user.tt', { user => $args->{user} } );
};

get '/tasks' => sub {
    my ($c) = @_;

    return $c->redirect('/auth') unless $c->current_user;

    $c->render( 'tasks.tt', { user => $c->current_user->name } );
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

get '/logout' => sub {
    my ($c) = @_;

    $c->current_user(undef);

    $c->redirect('/');
};

1;
