package Gotumda::DB::Row::Task;
use warnings;
use strict;
use parent 'Teng::Row';

sub to_hashref {
    my ($self) = @_;

    my $c           = Amon2->context();
    my $user        = $c->db->single( user => { name => $self->user_name } );
    my $owner       = $c->db->single( user => { name => $self->owner_name } );
    my $origin_task = ( $self->origin_task_id
            && $c->db->single( task => { id => $self->origin_task_id } ) );

    return +{
        id   => $self->id,
        body => Encode::decode( 'utf8', $self->body ),
        user => $user ? $user->to_hashref
        : { name          => $self->user_name,
            image_url     => '/static/img/no-image.gif',
            thumbnail_url => '/static/img/no-image-s.gif',
        },
        owner => $owner ? $owner->to_hashref
        : { name          => $self->owner_name,
            image_url     => '/static/img/no-image.gif',
            thumbnail_url => '/static/img/no-image-s.gif',
        },
        origin_task => $origin_task && $origin_task->to_hashref,
        is_done     => $self->is_done,
        created_at  => $self->created_at->epoch,
    };
}

1;
