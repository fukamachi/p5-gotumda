package Gotumda::Web::Dispatcher;
use strict;
use warnings;
use Amon2::Web::Dispatcher::Lite;
use Hatena::API::Auth;

get '/' => sub {
    my ($c) = @_;
    $c->render( 'index.tt', { user => $c->session->get('user') } );
};

get '/project/:project' => sub {
    my ($c) = @_;
    $c->render( 'project.tt', { user => $c->session->get('user') } );
};

get '/tasks' => sub {
    my ($c) = @_;
    $c->render( 'tasks.tt', { user => $c->session->get('user') } );
};

any '/auth' => sub {
    my ($c) = @_;
    my $api = Hatena::API::Auth->new( $c->config->{'Hatena::API::Auth'} );

    if ( my $cert = $c->req->param('cert') ) {
        my $user = $api->login($cert)
            or die "Couldn't login: " . $api->errstr;
        $c->session->set( 'user' => $user );

        return $c->redirect('/');
    }

    return $c->redirect( $api->uri_to_login->as_string );
};

1;
