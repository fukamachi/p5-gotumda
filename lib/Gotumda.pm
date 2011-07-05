package Gotumda;
use strict;
use warnings;
use parent qw/Amon2/;
our $VERSION='0.01';
use 5.008001;

use Amon2::Config::Simple;
sub load_config { Amon2::Config::Simple->load(shift) }

__PACKAGE__->load_plugin(qw/DBI/);

sub user {
    my ($c, $user) = @_;
    $c->session->set('user') if $user;

    return $c->session->get('user');
}

sub get_user {
    my ( $c, $name ) = @_;

    return $c->dbh->selectrow_hashref(
        'SELECT name, image_url, thumbnail_url FROM user WHERE name = ?',
        {}, $name );
}

1;
