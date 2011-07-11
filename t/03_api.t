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

    # Timeline
    my $req
        = HTTP::Request->new( GET => 'http://localhost/api/all-tasks.json' );
    my $res = $cb->($req);
    is $res->code, 200;
    diag $res->content if $res->code != 200;

    # My Tasks
    $req = HTTP::Request->new( GET => 'http://localhost/api/tasks.json' );
    $res = $cb->($req);
    is $res->code,    403;
    is $res->content, '{"error":"Authorization required."}';

    # User's tasks
    $req = HTTP::Request->new(
        GET => 'http://localhost/api/tasks.json?user=nitro_idiot' );
    $res = $cb->($req);
    is $res->code,    200;
    is $res->content, '[]';

    # Project tasks
    $req = HTTP::Request->new(
        GET => 'http://localhost/api/project.json?project=hoge' );
    $res = $cb->($req);
    is $res->code, 200;
    };

done_testing;
