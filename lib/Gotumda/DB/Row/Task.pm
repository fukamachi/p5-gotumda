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
        is_done    => $self->is_done,
        created_at => $self->created_at->epoch,
    };
}

1;
