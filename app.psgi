use File::Spec;
use File::Basename;
use lib File::Spec->catdir( dirname(__FILE__), 'extlib', 'lib', 'perl5' );
use lib File::Spec->catdir( dirname(__FILE__), 'lib' );
use Gotumda::Web;
use Gotumda::API;
use Plack::Builder;

#====================
# Closure Template
#====================
my $soy_compiler = File::Spec->catfile( dirname(__FILE__), 'tool',
    'SoyToJsSrcCompiler.jar' );
my $tmpl_dir
    = File::Spec->catdir( dirname(__FILE__), 'static', 'js', 'got', 'tmpl' );

opendir( DIR, $tmpl_dir );
for my $file ( readdir(DIR) ) {
    if ( $file =~ s/\.soy$// ) {
        $file = File::Spec->catfile( $tmpl_dir, $file );
        my $cmd
            = "java -jar $soy_compiler --outputPathFormat ${file}.js ${file}.soy";
        `$cmd`;
    }
}
closedir(DIR);

builder {
    enable 'Plack::Middleware::Static',
        path => qr{^(?:/static/|/robot\.txt$|/favicon.ico$)},
        root => File::Spec->catdir( dirname(__FILE__) );
    enable 'Plack::Middleware::ReverseProxy';
    mount '/'    => Gotumda::Web->to_app();
    mount '/api' => Gotumda::API->to_app();
};
