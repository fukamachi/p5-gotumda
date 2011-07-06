package Gotumda::DB::Row::SortOrder;
use strict;
use warnings;
use parent 'Teng::Row';
use Mouse;

around 'update' => sub {
    my ( $orig, $self, $args ) = @_;

    $args->{sort_order}
        = ( join ',', reverse split /,/, $args->{sort_order} );

    return $self->$orig($args);
};

sub sort_tasks {
    my ( $self, $tasks ) = @_;

    my %order_id;
    {
        my @order_ids = split /,/, $self->sort_order;
        my $i = 0;
        %order_id = map { $_ => ++$i } @order_ids;
    }

    return sort {
        if (   exists $order_id{ $a->id }
            || exists $order_id{ $b->id } )
        {
            return $order_id{ $a->id } <=> $order_id{ $b->id };
        }

        return 1;
    } @$tasks;
}

1;
