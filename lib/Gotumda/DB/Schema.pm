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
        qw(id body user_name owner_name origin_task_id is_done created_at updated_at);
    inflate created_at => sub { Time::Piece->new(shift) };
    deflate created_at => sub { Time::Piece->new(shift)->epoch };
    inflate updated_at => sub { Time::Piece->new(shift) };
    deflate updated_at => sub { Time::Piece->new(shift)->epoch };
};

table {
    name 'task_comment';
    pk 'id';
    columns qw(id task_id body user_name created_at updated_at);
    inflate created_at => sub { Time::Piece->new(shift) };
    deflate created_at => sub { Time::Piece->new(shift)->epoch };
    inflate updated_at => sub { Time::Piece->new(shift) };
    deflate updated_at => sub { Time::Piece->new(shift)->epoch };
};

table {
    name 'watch_project';
    columns qw(user_name project);
};

table {
    name 'task_project';
    columns qw(project task_id);
};

table {
    name 'sort_order';
    columns qw(user_name sort_order);
};

table {
    name 'task_event';
    pk 'id';
    columns qw(id task_id event user_name created_at);
    inflate created_at => sub { Time::Piece->new(shift) };
    deflate created_at => sub { Time::Piece->new(shift)->epoch };
};

1;
