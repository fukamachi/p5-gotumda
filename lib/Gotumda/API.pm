package Gotumda::API;
use strict;
use warnings;
use parent qw/Gotumda Amon2::Web/;
use File::Spec;

# load all controller classes
use Module::Find ();
Module::Find::useall("Gotumda::API::C");

# dispatcher
use Gotumda::API::Dispatcher;

sub dispatch {
    my ($c) = @_;
    return Gotumda::API::Dispatcher->dispatch($c)
        or die "response is not generated";
}

# load plugins
use HTTP::Session::Store::File;
__PACKAGE__->load_plugins(
    'Web::HTTPSession' => {
        state => 'Cookie',
        store =>
            HTTP::Session::Store::File->new( dir => File::Spec->tmpdir(), )
    },
    'Web::JSON',
);

# for your security
__PACKAGE__->add_trigger(
    AFTER_DISPATCH => sub {
        my ( $c, $res ) = @_;
        $res->header( 'X-Content-Type-Options' => 'nosniff' );
        $res->header( 'Content-Type' => 'application/json; charset=utf-8' );
    },
);

__PACKAGE__->add_trigger(
    BEFORE_DISPATCH => sub {
        my ($c) = @_;

        if ( $c->req->method eq 'POST' ) {
            return $c->auth_required unless $c->current_user;
        }

        return;
    },
);

sub _create_response {
    my ( $c, $status, $message ) = @_;
    my $res = $c->render_json( $message ? { error => $message } : {} );
    $res->code($status);

    return $res;
}

sub no_content {
    my ($c) = @_;

    return $c->_create_response(204);
}

sub bad_request {
    my ( $c, $message ) = @_;

    return $c->_create_response( 400, $message );
}

sub forbidden {
    my ( $c, $message ) = @_;

    return $c->_create_response( 403, $message );
}

sub auth_required {
    my ($c) = @_;

    return $c->_create_response( 401, 'Authorization required.' );
}

sub permission_denied {
    $_[0]->forbidden('Permission denied.');
}

1;
