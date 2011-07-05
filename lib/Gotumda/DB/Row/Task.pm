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

# FIXME: this don't have to be called when the body isn't modified.
sub parse_body {
    my ($self) = @_;

    my @projects = ( $self->body =~ /(?<=#)(\w+)/g );

    my $c = Amon2->context();

    # flush current data.
    if (@projects) {
        $c->db->delete( task_project => { task_id => $self->id } );
    }

    for my $project (@projects) {
        $c->db->fast_insert(
            task_project => { project => $project, task_id => $self->id } );
        $c->db->find_or_create( watch_project =>
                { user_name => $self->user_name, project => $project } );
    }

    if ( my ($owner_name) = ( $self->body =~ /(?<=@)(\w+)/g ) ) {
        $self->update( { owner_name => $owner_name } );
        $self->owner_name($owner_name);
    }
}

1;
