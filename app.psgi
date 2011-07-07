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
my $js_dir   = File::Spec->catdir( dirname(__FILE__), 'static', 'js' );
my $tmpl_dir = File::Spec->catdir( $js_dir,           'got',    'tmpl' );

opendir( DIR, $tmpl_dir );
for my $file ( readdir(DIR) ) {
    if ( $file =~ s/\.soy$// ) {
        $file = File::Spec->catfile( $tmpl_dir, $file );
        system(
            <<CMD
            java -jar $soy_compiler\\
            --shouldProvideRequireSoyNamespaces\\
            --outputPathFormat ${file}.js ${file}.soy
CMD
        );
    }
}
closedir(DIR);

#====================
# Closure Library
#====================
system(
    <<CMD
    python $js_dir/closure-library/closure/bin/build/depswriter.py\\
    --root_with_prefix='$js_dir/got ../../../got'\\
    --output_file=$js_dir/gotdeps.js
CMD
);

builder {
    enable 'Plack::Middleware::Static',
        path => qr{^(?:/static/|/robot\.txt$|/favicon.ico$)},
        root => File::Spec->catdir( dirname(__FILE__) );
    enable 'Plack::Middleware::ReverseProxy';
    mount '/'    => Gotumda::Web->to_app();
    mount '/api' => Gotumda::API->to_app();
};
