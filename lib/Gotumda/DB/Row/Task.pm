package Gotumda::DB::Row::Task;
use warnings;
use strict;
use parent 'Teng::Row';

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
        body => Encode::decode( 'utf8', $self->body ),
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
        my $iter = $c->db->search(
            task_comment => { task_id => $self->id },
            { order_by => { created_at => 'ASC' } }
        );
        $result->{comments} = [ map { $_->to_hashref } $iter->all ];
    }

    return $result;
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

    return $c->db->single( task => { id => $id } );
}

1;
