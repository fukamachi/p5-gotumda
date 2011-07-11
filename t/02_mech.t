use strict;
use warnings;
use t::Util;
use Plack::Test;
use Plack::Util;
use Test::More;
use Test::Requires 'Test::WWW::Mechanize::PSGI';

my $app = Plack::Util::load_psgi 'app.psgi';

my $mech = Test::WWW::Mechanize::PSGI->new( app => $app );

$mech->get_ok('/');

$mech->get('/tasks');
$mech->base_like( qr{^http://auth\.hatena\.ne\.jp/auth},
    'redirect to Hatena' );

$mech->get_ok('/project/hoge');

done_testing;
