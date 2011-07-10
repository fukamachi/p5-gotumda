package Gotumda::DB;
use parent 'Teng';
use Mouse;

__PACKAGE__->load_plugin('FindOrCreate');
__PACKAGE__->load_plugin('Count');

around [qw(insert update)] => sub {
    my ( $orig, $self, $table_name, $row_data, $other ) = @_;

    if ( $table_name eq 'task' and exists $row_data->{body} ) {
        if ( my ($owner_name) = ( $row_data->{body} =~ /(?<=@)(\w+)/g ) ) {
            $row_data->{owner_name} = $owner_name;
        }
    }

    return $self->$orig( $table_name, $row_data, $other );
};

sub _parse_task_project {
    my ( $id, $body ) = @_;

    my $c = Amon2->context();

    my @projects = ( $body =~ /(?<=#)(\w+)/g );

    for my $project (@projects) {
        $c->db->fast_insert(
            task_project => {
                project => $project,
                task_id => $id,
            }
        );
        $c->db->find_or_create( watch_project =>
                { user_name => $c->current_user->name, project => $project }
        );
    }
}

around [qw(insert update)] => sub {
    my ( $orig, $self, $table_name, $row_data, $other ) = @_;

    my $result = $self->$orig( $table_name, $row_data, $other );

    return $result unless $table_name eq 'task';

    if ( exists $row_data->{body} ) {
        my $id;
        if ( ref $result ) {
            $id = $result->id;
        }
        elsif ( exists $row_data->{id} ) {
            $id = $row_data->{id};
        }
        else {
            $id = $result;
        }

        _parse_task_project( $id, $row_data->{body} );
    }

    return $result;
};

sub has_permission {
    my ( $task_id, $user_name ) = @_;

    my $c = Amon2->context();
    $user_name ||= $c->current_user->name;

    $c->db->search_named(
        'SELECT COUNT(id) FROM task WHERE id = :id AND (owner_name = :user OR user_name = :user)',
        {   id   => $task_id,
            user => $user_name,
        }
    );
}

1;
