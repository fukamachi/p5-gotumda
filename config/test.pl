+{
    'Teng' => {
        dsn => 'dbi:SQLite:dbname=test.db',
        username => '',
        password => '',
        connect_options => +{
            sqlite_unicode => 1,
        },
    },
    'Text::Xslate' => {
        path => ['tmpl/'],
    },
};
