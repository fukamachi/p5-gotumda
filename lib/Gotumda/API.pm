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
    },
);

__PACKAGE__->add_trigger(
    BEFORE_DISPATCH => sub {
        my ($c) = @_;

        # ...
        return;
    },
);

1;
