package Gotumda::DB::Row::Task;
use warnings;
use strict;
use parent 'Teng::Row';

use aliased 'Gotumda::DB::Row::User';

sub to_hashref {
    my ($self) = @_;

    my $c           = Amon2->context();
    my $user        = $c->db->single( user => { name => $self->user_name } );
    my $owner       = $c->db->single( user => { name => $self->owner_name } );
    my $origin_task = ( $self->origin_task_id
            && $c->db->single( task => { id => $self->origin_task_id } ) );

    return +{
        id          => $self->id,
        body        => Encode::decode( 'utf8', $self->body ),
        user        => User::to_hashref( $user || $self->user_name ),
        owner       => User::to_hashref( $owner || $self->owner_name ),
        origin_task => $origin_task && $origin_task->to_hashref,
        is_done     => $self->is_done,
        created_at  => $self->created_at->epoch,
        updated_at  => $self->updated_at->epoch,
    };
}

sub copy {
    my ($self) = @_;

    my $c = Amon2->context();

    # NOTE: Why `fast_insert', not just `insert'?
    #   Because `insert' may modify the owner_name automatically.
    #   See Gotumda::DB for detail.
    my $id = $c->db->fast_insert(
        task => {
            body           => $self->body,
            user_name      => $c->current_user->name,
            owner_name     => $c->current_user->name,
            origin_task_id => $self->id,
            is_done        => $self->is_done,
        }
    );

    return $c->db->single( task => { id => $id } );
}

1;
