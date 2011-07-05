package Gotumda::DB::Row::User;
use warnings;
use strict;
use parent 'Teng::Row';

sub to_hashref {
    my ($self) = @_;

    return +{
        name          => $self->name,
        image_url     => $self->image_url,
        thumbnail_url => $self->thumbnail_url,
    };
}

1;
