package Gotumda::DB::Row::WatchProject;
use strict;
use warnings;
use parent 'Teng::Row';

sub to_hashref {
    my ($self) = @_;

    my $c = Amon2->context();
    return +{
        project   => $self->project,
        user_name => $self->user_name,
        num       => $c->db->search_named(
            'SELECT COUNT(task_id) AS num
             FROM task_project WHERE project = :project',
            { project => $self->project }
            )->next->num,
    };
}

1;
