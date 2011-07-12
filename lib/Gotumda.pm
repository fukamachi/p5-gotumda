package Gotumda;
use strict;
use warnings;
use parent qw/Amon2/;
our $VERSION = '0.01';
use 5.008001;

sub current_user {
    my ( $c, $user ) = @_;
    $c->session->set( 'user', $user ) if @_ >= 2;

    return $c->session->get('user');
}

use Gotumda::DB;

sub db {
    my ($c) = @_;
    if ( !defined $c->{db} ) {
        my $conf = $c->config->{'Teng'}
            or die "missing configuration for 'Teng'";
        my $dbh = DBI->connect(
            $conf->{dsn},      $conf->{username},
            $conf->{password}, $conf->{connect_options}
        ) or die "Cannot connect to DB:: " . $DBI::errstr;
        $c->{db} = Gotumda::DB->new( { dbh => $dbh } );
    }

    return $c->{db};
}

1;
