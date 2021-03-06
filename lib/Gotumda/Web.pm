package Gotumda::Web;
use strict;
use warnings;
use parent qw/Gotumda Amon2::Web/;
use File::Spec;

# load all controller classes
use Module::Find ();
Module::Find::useall("Gotumda::Web::C");

# dispatcher
use Gotumda::Web::Dispatcher;

sub dispatch {
    return Gotumda::Web::Dispatcher->dispatch( $_[0] )
        or die "response is not generated";
}

# setup view class
use Text::Xslate;
{
    my $view_conf = __PACKAGE__->config->{'Text::Xslate'} || +{};
    unless ( exists $view_conf->{path} ) {
        $view_conf->{path}
            = [ File::Spec->catdir( __PACKAGE__->base_dir(), 'tmpl' ) ];
    }
    my $view = Text::Xslate->new(
        +{  'syntax'   => 'TTerse',
            'module'   => ['Text::Xslate::Bridge::TT2Like'],
            'function' => {
                c            => sub { Amon2->context() },
                mode_name    => sub { Gotumda->mode_name() },
                uri_with     => sub { Amon2->context()->req->uri_with(@_) },
                uri_for      => sub { Amon2->context()->uri_for(@_) },
                path_info    => sub { Amon2->context()->req->path_info },
                my_tasks_num => sub {
                    Amon2->context()->db->count(
                        'task', 'id',
                        {   owner_name =>
                                Amon2->context()->current_user->name,
                            is_done => undef,
                        }
                    );
                },
                current_user => sub { Amon2->context()->current_user },
            },
            %$view_conf
        }
    );
    sub create_view {$view}
}

# load plugins
use HTTP::Session::Store::File;
__PACKAGE__->load_plugins(
    'Web::FillInFormLite',
    'Web::NoCache',    # do not cache the dynamic content by default
    'Web::CSRFDefender',
    'Web::HTTPSession' => {
        state => 'Cookie',
        store =>
            HTTP::Session::Store::File->new( dir => File::Spec->tmpdir(), )
    },
);

# for your security
__PACKAGE__->add_trigger(
    AFTER_DISPATCH => sub {
        my ( $c, $res ) = @_;
        $res->header( 'X-Content-Type-Options' => 'nosniff' );
    },
);

__PACKAGE__->add_trigger(
    BEFORE_DISPATCH => sub {
        my ($c) = @_;

        # ...
        return;
    },
);

1;
