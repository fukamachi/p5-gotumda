package Gotumda::DB::Row::TaskComment;
use strict;
use warnings;
use parent 'Teng::Row';

sub to_hashref {
    my ($self) = @_;

    my $c = Amon2->context();
    my $user = $c->db->single( user => { name => $self->user_name } );

    return +{
        id      => $self->id,
        task_id => $self->task_id,
        body    => utf8::is_utf8( $self->body )
        ? $self->body
        : Encode::decode( 'utf8', $self->body ),
        user =>
            Gotumda::DB::Row::User::to_hashref( $user || $self->user_name ),
        created_at => $self->created_at->epoch,
        updated_at => $self->updated_at->epoch,
    };
}

1;
