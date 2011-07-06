package Gotumda::DB;
use parent 'Teng';

__PACKAGE__->load_plugin('FindOrCreate');
__PACKAGE__->load_plugin('Count');

1;
