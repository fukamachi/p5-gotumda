# Gotumda+ - Communicate over tasks.

## Setup

1. Build and install dependencies.

    $ perl Makefile.PL
    $ make

2. Modify configuration

As Gotumda+ uses Hatena::API to authorize users, you have to get your own API key from [Hatena::API::Auth](http://auth.hatena.ne.jp/) and set it to `config/development.pl`.

    $ cp config/development.pl.example config/development.pl
    $ vi config/development.pl

3. Database

Make sure a SQLite3 database is in the application root directory before starting an application.

    $ sqlite3 development.db < sql/sqlite3.sql

Of course you can use MySQL instead if you want. Then you change the configuration of "Teng" in `config/development.pl`, create a database, and execute all sql in `sql/my.sql` and `sql/trigger.sql`.

4. Run

    $ plackup app.psgi

See [http://localhost:5000/](http://localhost:5000/) on your browser.

## Development Note

* Framework: [Amon2](amon.64p.org)
* Template Engine: [Xslate](http://xslate.org/)
* O/R Mapper: [Teng](http://search.cpan.org/~nekokak/Teng-0.11/lib/Teng.pm)

## Author

* Eitarow Fukamachi (e.arrows@gmail.com)

## Copyright

Copyright (c) 2011 Eitarow Fukamachi

## License

Licensed under the Apache License 2.0.
