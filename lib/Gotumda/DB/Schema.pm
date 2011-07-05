package Gotumda::DB::Schema;
use strict;
use warnings;
use Teng::Schema::Declare;
use Time::Piece;

table {
    name 'user';
    pk 'name';
    columns qw(name image_url thumbnail_url);
};

table {
    name 'task';
    pk 'id';
    columns
        qw(id body user_name owner_name origin_task_id is_done created_at);
    inflate created_at => sub { Time::Piece->new(shift) };
    deflate created_at => sub { Time::Piece->new(shift)->epoch };
};

table {
    name 'watch_project';
    columns qw('user_name project');
};

1;
