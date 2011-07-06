use strict;
use warnings;
use t::Util;
use Plack::Test;
use Plack::Util;
use Test::More;

my $app = Plack::Util::load_psgi 'app.psgi';
test_psgi
    app    => $app,
    client => sub {
    my $cb = shift;
    my $req
        = HTTP::Request->new( GET => 'http://localhost/api/all-tasks.json' );
    my $res = $cb->($req);
    is $res->code, 200;
    diag $res->content if $res->code != 200;

    $req = HTTP::Request->new( GET => 'http://localhost/api/my-tasks.json' );
    $res = $cb->($req);
    is $res->code,    400;
    is $res->content, '{"error":"Authorization required."}';

    $req = HTTP::Request->new(
        GET => 'http://localhost/api/project.json?project=hoge' );
    $res = $cb->($req);
    is $res->code, 200;
    diag $res->content if $res->code != 200;
    };

done_testing;
