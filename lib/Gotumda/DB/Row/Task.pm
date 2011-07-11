package Gotumda::DB::Row::Task;
use utf8;
use warnings;
use strict;
use parent 'Teng::Row';
use Mouse;

sub to_hashref {
    my ( $self, %params ) = @_;

    $params{with_comments} = 1 unless exists $params{with_comments};

    my $c           = Amon2->context();
    my $user        = $c->db->single( user => { name => $self->user_name } );
    my $owner       = $c->db->single( user => { name => $self->owner_name } );
    my $origin_task = ( $self->origin_task_id
            && $c->db->single( task => { id => $self->origin_task_id } ) );

    my $result = {
        id   => $self->id,
        body => utf8::is_utf8( $self->body )
        ? $self->body
        : Encode::decode( 'utf8', $self->body ),
        user =>
            Gotumda::DB::Row::User::to_hashref( $user || $self->user_name ),
        owner =>
            Gotumda::DB::Row::User::to_hashref( $owner || $self->owner_name ),
        origin_task => $origin_task
            && $origin_task->to_hashref( with_comments => 0 ),
        is_done    => $self->is_done,
        created_at => $self->created_at->epoch,
        updated_at => $self->updated_at->epoch,
    };

    if ( $params{with_comments} ) {
        my $iter = $c->db->search_named(
            <<SQL
            SELECT 0 as is_event, id, task_id, body, user_name, created_at
            FROM task_comment WHERE task_id = :id
            UNION
            SELECT 1 as is_event, id, task_id, event, user_name, created_at
            FROM task_event WHERE task_id = :id
            ORDER BY created_at;
SQL
            , { id => $self->id }, 'task_comment'
        );

        # NOTE: Should this code be in DB::Row::TaskComment#to_hashref?
        $result->{comments} = [];
        while ( my $row = $iter->next ) {
            my $hashref = $row->to_hashref;
            $hashref->{is_event} = $row->is_event;
            if ( $row->is_event ) {
                if ( $row->body eq 'copy' ) {
                    $hashref->{body} = 'Copied by ';
                }
                elsif ( $row->body eq 'move' ) {
                    $hashref->{body} = 'Reassigned to ';
                }
            }
            push @{ $result->{comments} }, $hashref;
        }
    }

    return $result;
}

sub has_permission {
    my ( $self, $user_name ) = @_;

    my $c = Amon2->context();
    $user_name ||= $c->current_user->name;

    return $c->db->search_named(
        'SELECT COUNT(id) as num FROM task WHERE id = :id AND (owner_name = :user OR user_name = :user)',
        {   id   => $self->id,
            user => $user_name,
        }
    )->next->num;
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
    $self->insert_event('copy');

    return $c->db->single( task => { id => $id } );
}

sub move {
    my ($self) = @_;

    my $c = Amon2->context();

    $self->update( { owner_name => $c->current_user->name } );
    $self->insert_event('move');

    return $self;
}

before 'update' => sub {
    my ( $self, $row_data ) = @_;

    if ( exists $row_data->{body} ) {
        Amon2->context()
            ->db->delete( task_project => { task_id => $self->id } );
    }
};

sub insert_event {
    my ( $self, $event, $user_name ) = @_;

    my $c = Amon2->context();

    $user_name ||= $c->current_user->name;

    $c->db->fast_insert(
        task_event => {
            task_id   => $self->id,
            event     => $event,
            user_name => $user_name,
        }
    );
}

1;
