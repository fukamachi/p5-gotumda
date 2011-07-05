package Gotumda::API::Dispatcher;
use strict;
use warnings;
use Amon2::Web::Dispatcher::Lite;

get '/all-tasks.json' => sub {
    my ($c) = @_;
    my $iter = $c->db->search(
        task => {},
        { order_by => { created_at => 'DESC' } },
    );

    return $c->render_json( [ map { $_->to_hashref } $iter->all ] );
};

post '/update.json' => sub {
    my ($c) = @_;
    my $user = $c->current_user;
    $c->redirect('/auth') unless $user;

    my $task = $c->db->insert(
        task => {
            body       => $c->req->param('body'),
            user_name  => $user->name,              # TODO
            owner_name => $user->name,              # TODO
        }
    );

    return $c->render_json( $task->to_hashref );
};

1;
