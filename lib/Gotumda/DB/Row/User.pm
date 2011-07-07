package Gotumda::DB::Row::User;
use warnings;
use strict;
use parent 'Teng::Row';

sub to_hashref {
    my ($self) = @_;

    if ( ref $self ) {
        return +{
            name          => $self->name,
            image_url     => $self->image_url,
            thumbnail_url => $self->thumbnail_url,
        };
    }
    else {
        return +{
            name          => $self,
            image_url     => '/static/img/no-image.gif',
            thumbnail_url => '/static/img/no-image-s.gif',
        };
    }
}

1;
