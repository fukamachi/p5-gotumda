package Gotumda::DB::Row::Task;
use warnings;
use strict;
use parent 'Teng::Row';

sub to_hashref {
    my ($self) = @_;

    my $c     = Amon2->context();
    my $user  = $c->db->single( user => { name => $self->user_name } );
    my $owner = $c->db->single( user => { name => $self->owner_name } );

    return +{
        id         => $self->id,
        body       => $self->body,
        user       => $user && $user->to_hashref,
        owner      => $owner && $owner->to_hashref,
        is_done    => $self->is_done,
        created_at => $self->created_at->epoch,
    };
}

1;
