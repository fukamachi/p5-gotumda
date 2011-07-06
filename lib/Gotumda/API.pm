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

        # ...
        return;
    },
);

sub no_content {
    my ($c) = @_;
    my $res = $c->render_json( {} );
    $res->code(204);

    return $res;
}

sub bad_request {
    my ( $c, $message ) = @_;
    my $res = $c->render_json( { "error" => $message } );
    $res->code(400);

    return $res;
}

1;
