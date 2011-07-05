+{
    'DBI' => [
        'dbi:SQLite:dbname=development.db',
        '',
        '',
        +{
            sqlite_unicode => 1,
        }
    ],
    'Text::Xslate' => {
        path => ['tmpl/'],
    },
    'Hatena::API::Auth' => {
        api_key => "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        secret => "xxxxxxxxxxxxxxxx",
    },
};
