use strict;
use warnings;
use Test::More;

use_ok $_ for qw(
    Gotumda
    Gotumda::Web
    Gotumda::Web::Dispatcher
    Gotumda::API
    Gotumda::API::Dispatcher
    Gotumda::DB
    Gotumda::DB::Schema
    Gotumda::DB::Row::Task
    Gotumda::DB::Row::User
    Gotumda::DB::Row::WatchProject
);

done_testing;
