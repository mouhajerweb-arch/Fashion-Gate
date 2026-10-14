<?php
namespace FashionGate\ElementorExperience;
defined('ABSPATH') || exit;
final class Platform {
    public static function activate(): void {
        global $wpdb;
        require_once ABSPATH.'wp-admin/includes/upgrade.php';
        dbDelta("CREATE TABLE {$wpdb->prefix}fg_gates (
            gate_key varchar(64) NOT NULL,
            hits bigint unsigned NOT NULL DEFAULT 0,
            expires bigint unsigned NOT NULL,
            PRIMARY KEY  (gate_key),
            KEY expires (expires)
        ) {$wpdb->get_charset_collate()};");
        if(!wp_next_scheduled('fg_cleanup_gates')) { wp_schedule_event(time(),'hourly','fg_cleanup_gates'); }
        $caps=['read'=>true,'upload_files'=>true];
        foreach(['edit_pages','edit_others_pages','edit_published_pages','publish_pages','delete_pages','delete_others_pages','delete_published_pages','read_private_pages','edit_private_pages','delete_private_pages','edit_posts','edit_others_posts','edit_published_posts','publish_posts','delete_posts','delete_others_posts','delete_published_posts'] as $cap) { $caps[$cap]=true; }
        add_role('fg_marketing_manager','Fashion Gate Marketing Manager',$caps);
    }
    public static function get_current_lang(): string {
        // 1. Explicit query var
        $lang = get_query_var('fg_lang');
        if ($lang && in_array($lang, ['ar', 'en'], true)) {
            return $lang;
        }

        // 2. Explicit GET parameter
        if (isset($_GET['lang'])) {
            $g_lang = sanitize_text_field($_GET['lang']);
            if (in_array($g_lang, ['ar', 'en'], true)) {
                return $g_lang;
            }
        }

        // 3. Elementor preview or admin post check
        $post_id = 0;
        if (isset($_GET['elementor-preview'])) {
            $post_id = (int)$_GET['elementor-preview'];
        } elseif (isset($_GET['post'])) {
            $post_id = (int)$_GET['post'];
        } elseif (function_exists('get_the_ID') && get_the_ID()) {
            $post_id = get_the_ID();
        } elseif (function_exists('get_queried_object_id') && get_queried_object_id()) {
            $post_id = get_queried_object_id();
        }

        if ($post_id > 0) {
            $p = get_post($post_id);
            if ($p) {
                if ($p->post_name === 'landing-ar' || str_contains($p->post_name, 'ar') || str_contains($p->post_title, 'Arabic')) {
                    return 'ar';
                }
                if ($p->post_name === 'landing' || str_contains($p->post_name, 'en') || str_contains($p->post_title, 'English')) {
                    return 'en';
                }
            }
        }

        // 4. URL path matching
        if (isset($_SERVER['REQUEST_URI'])) {
            $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
            if (preg_match('#/(?:landing-ar|ar)(?:/|$)#i', $path)) {
                return 'ar';
            }
            if (preg_match('#/(?:landing-en|en|landing)(?:/|$)#i', $path)) {
                return 'en';
            }
        }

        // 5. Multilingual plugin fallback
        if (function_exists('pll_current_language')) {
            $pll = pll_current_language('slug');
            if (in_array($pll, ['ar', 'en'], true)) {
                return $pll;
            }
        }

        return 'ar';
    }


    public static function boot(): void {
        add_action('init', static function() {
            add_rewrite_rule('^landing/ar/?$', 'index.php?pagename=landing-ar&fg_lang=ar', 'top');
            add_rewrite_rule('^landing/en/?$', 'index.php?pagename=landing&fg_lang=en', 'top');
            add_rewrite_rule('^ar/?$', 'index.php?pagename=landing-ar&fg_lang=ar', 'top');
            add_rewrite_rule('^en/?$', 'index.php?pagename=landing&fg_lang=en', 'top');
        });
        add_filter('query_vars', static function($vars) {
            $vars[] = 'fg_lang';
            return $vars;
        });
        add_action('template_redirect', static function() {
            if (is_admin()) return;
            if (isset($_GET['elementor-preview']) || isset($_GET['preview']) || isset($_GET['elementor_library'])) return;
            $uri = $_SERVER['REQUEST_URI'] ?? '';
            $path = parse_url($uri, PHP_URL_PATH);
            if ($path === '/landing' || $path === '/landing/') {
                wp_safe_redirect(home_url('/landing/ar'), 302);
                exit;
            }
        });
        add_filter('admin_locale', static function() {
            return 'en_US';
        });
        add_action('admin_init', static function() {
            $GLOBALS['text_direction'] = 'ltr';
        });
        add_filter('locale', static function($locale) {
            if (is_admin()) {
                return 'en_US';
            }
            $lang = self::get_current_lang();
            if ($lang === 'ar') {
                return 'ar';
            }
            return 'en_US';
        });
        add_action('wp', static function() {
            if (is_admin()) return;
            $lang = self::get_current_lang();
            if ($lang === 'ar') {
                $GLOBALS['text_direction'] = 'rtl';
            } else {
                $GLOBALS['text_direction'] = 'ltr';
            }
        });
        add_filter('language_attributes', static function($output) {
            if (is_admin()) {
                return 'lang="en-US" dir="ltr"';
            }
            $lang = self::get_current_lang();
            if ($lang === 'ar') {
                return 'lang="ar" dir="rtl"';
            }
            return 'lang="en-US" dir="ltr"';
        });
        add_filter('body_class', static function($classes) {
            if (is_admin()) return $classes;
            $lang = self::get_current_lang();
            if ($lang === 'ar') {
                $classes[] = 'rtl';
                $classes[] = 'fg-rtl';
                $classes[] = 'elementor-rtl';
                $classes = array_diff($classes, ['ltr']);
            } else {
                $classes[] = 'ltr';
                $classes = array_diff($classes, ['rtl', 'fg-rtl', 'elementor-rtl']);
            }
            return array_unique($classes);
        });
        add_filter('pre_option_elementor_element_cache_ttl', static function() {
            return 'disable';
        });
        add_filter('get_post_metadata', static function($value, $object_id, $meta_key, $single) {
            if ($meta_key === '_elementor_element_cache') {
                return $single ? '' : [''];
            }
            return $value;
        }, 10, 4);
        // Match the existing Next trailingSlash:false policy without changing main-site routing.
        $normalize=static function($url) {
            if(!is_string($url) || in_array(wp_parse_url($url,PHP_URL_PATH),['', '/', null],true)) { return $url; }
            return preg_replace('~/+(?=[?#]|$)~','',$url);
        };
        add_filter('redirect_canonical',$normalize);
        add_filter('pll_redirect_home',$normalize);
        add_filter('wpseo_canonical',$normalize);
        add_filter('wpseo_opengraph_url',$normalize);
        add_filter('rank_math/frontend/canonical',$normalize);
        foreach(['wpseo_sitemap_entry','rank_math/sitemap/entry','wp_sitemaps_posts_entry'] as $hook) {
            add_filter($hook,static function($entry) use ($normalize) { if(is_array($entry)&&isset($entry['loc'])) { $entry['loc']=$normalize($entry['loc']); } return $entry; });
        }
        add_shortcode('fg_languages',static function () {
            if(!function_exists('pll_the_languages')) { return ''; }
            return '<nav aria-label="'.esc_attr__('Languages','fashiongate').'"><ul class="fg-languages">'.pll_the_languages(['echo'=>0,'hide_if_empty'=>1,'hide_if_no_translation'=>1]).'</ul></nav>';
        });

        // ---------------------------------------------------------------------
        // Next.js High-End Luxury SEO & Structured Data Parity
        // ---------------------------------------------------------------------
        add_filter('pre_get_document_title', static function($title) {
            if (is_admin()) return $title;
            $lang = self::get_current_lang();
            if ($lang === 'ar') {
                return 'فاشن غيت مول | أول وجهة للمتاجر الكبرى الفاخرة في سوريا';
            }
            return 'Fashion Gate Mall | Syria\'s Luxury Department Destination';
        }, 99);

        add_action('wp_head', static function() {
            if (is_admin()) return;
            $lang = self::get_current_lang();
            $is_ar = ($lang === 'ar');

            $base_url = 'https://fashiongatemall.com';
            $canonical_url = $is_ar ? "{$base_url}/landing/ar" : "{$base_url}/landing/en";
            $ar_url = "{$base_url}/landing/ar";
            $en_url = "{$base_url}/landing/en";

            $title = $is_ar 
                ? 'فاشن غيت مول | أول وجهة للمتاجر الكبرى الفاخرة في سوريا'
                : 'Fashion Gate Mall | Syria\'s Luxury Department Destination';

            $desc = $is_ar
                ? 'أول وجهة للمتاجر الكبرى الفاخرة في سوريا. دمج الملابس الراقية، الجمال المنسق، والتسوق الحصري تحت رؤية معمارية حديثة.'
                : 'Syria\'s first luxury department destination. Integrating fine apparel, curated beauty, and bespoke boutique shopping under a modern architectural vision.';

            $keywords = 'Fashion Gate, Fashion Gate Mall, Damascus Boulevard, Luxury Mall Syria, مول بوابة الأزياء دمشق, فاشن غيت دمشق, أول مول فاخر في سوريا';
            $image_url = FG_EXPERIENCE_URL . 'assets/media/hero-woman-wide.png';
            $logo_url = FG_EXPERIENCE_URL . 'assets/media/logo.png';

            echo "\n<!-- Fashion Gate Luxury SEO & Meta Parity -->\n";
            echo '<meta name="description" content="' . esc_attr($desc) . '">' . "\n";
            echo '<meta name="keywords" content="' . esc_attr($keywords) . '">' . "\n";
            echo '<link rel="canonical" href="' . esc_url($canonical_url) . '">' . "\n";
            echo '<link rel="alternate" hreflang="en" href="' . esc_url($en_url) . '">' . "\n";
            echo '<link rel="alternate" hreflang="ar" href="' . esc_url($ar_url) . '">' . "\n";
            echo '<link rel="alternate" hreflang="x-default" href="' . esc_url($en_url) . '">' . "\n";

            // OpenGraph
            echo '<meta property="og:type" content="website">' . "\n";
            echo '<meta property="og:site_name" content="' . esc_attr($is_ar ? 'فاشن غيت مول' : 'Fashion Gate Mall') . '">' . "\n";
            echo '<meta property="og:title" content="' . esc_attr($title) . '">' . "\n";
            echo '<meta property="og:description" content="' . esc_attr($desc) . '">' . "\n";
            echo '<meta property="og:url" content="' . esc_url($canonical_url) . '">' . "\n";
            echo '<meta property="og:locale" content="' . ($is_ar ? 'ar_SY' : 'en_US') . '">' . "\n";
            echo '<meta property="og:locale:alternate" content="' . ($is_ar ? 'en_US' : 'ar_SY') . '">' . "\n";
            echo '<meta property="og:image" content="' . esc_url($image_url) . '">' . "\n";
            echo '<meta property="og:image:width" content="1200">' . "\n";
            echo '<meta property="og:image:height" content="630">' . "\n";
            echo '<meta property="og:image:alt" content="' . esc_attr($title) . '">' . "\n";

            // Twitter Cards
            echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
            echo '<meta name="twitter:title" content="' . esc_attr($title) . '">' . "\n";
            echo '<meta name="twitter:description" content="' . esc_attr($desc) . '">' . "\n";
            echo '<meta name="twitter:image" content="' . esc_url($image_url) . '">' . "\n";

            // JSON-LD Structured Data
            $org_schema = [
                '@context' => 'https://schema.org',
                '@type' => 'Organization',
                'name' => 'Fashion Gate Mall Syria',
                'alternateName' => 'فاشن غيت مول سوريا',
                'url' => $base_url,
                'logo' => $logo_url,
                'sameAs' => [
                    'https://www.instagram.com/fashiongatemall',
                    'https://www.facebook.com/fashiongatemall'
                ],
                'contactPoint' => [
                    '@type' => 'ContactPoint',
                    'telephone' => '+963-930-000-000',
                    'contactType' => 'customer service',
                    'availableLanguage' => ['Arabic', 'English']
                ]
            ];

            $store_schema = [
                '@context' => 'https://schema.org',
                '@type' => 'DepartmentStore',
                'name' => 'Fashion Gate Mall',
                'alternateName' => 'فاشن غيت مول دمشق',
                'image' => $image_url,
                '@id' => $base_url,
                'url' => $base_url,
                'telephone' => '+963-930-000-000',
                'priceRange' => '$$$$',
                'address' => [
                    '@type' => 'PostalAddress',
                    'streetAddress' => 'Damascus Boulevard District',
                    'addressLocality' => 'Damascus',
                    'addressCountry' => 'SY'
                ],
                'openingHoursSpecification' => [
                    [
                        '@type' => 'OpeningHoursSpecification',
                        'dayOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                        'opens' => '10:00',
                        'closes' => '22:00'
                    ]
                ]
            ];

            echo '<script type="application/ld+json">' . wp_json_encode($org_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . '</script>' . "\n";
            echo '<script type="application/ld+json">' . wp_json_encode($store_schema, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) . '</script>' . "\n";
            echo "<!-- /Fashion Gate Luxury SEO -->\n";
        }, 1);

        // Privacy preferences and consent banner removed per request
        add_action('send_headers',static function () {
            if(!is_admin()) { header('Cache-Control: private, no-store, max-age=0'); }
            if(wp_get_environment_type()!=='production') { header('X-Robots-Tag: noindex, nofollow'); }
        });
        add_filter('wp_robots',static function($robots) {
            if(wp_get_environment_type()!=='production') { $robots['noindex']=true; $robots['nofollow']=true; unset($robots['index']); }
            return $robots;
        });
        add_action('admin_notices',static function () {
            if(!current_user_can('manage_options')) { return; }
            $missing=[];
            if(!defined('WPSEO_VERSION') && !defined('RANK_MATH_VERSION')) { $missing[]='Install/configure one SEO plugin (Yoast or Rank Math).'; }
            if(!function_exists('pll_current_language') && !defined('ICL_SITEPRESS_VERSION')) { $missing[]='Configure Polylang or the existing multilingual plugin.'; }
            if(!getenv('FG_LEAD_DESTINATION')) { $missing[]='Configure a lead destination before publishing forms.'; }
            if(!file_exists(FG_EXPERIENCE_PATH.'assets/vendor/gsap.min.js')) { $missing[]='Build plugin assets before deploying.'; }
            if($missing) { echo '<div class="notice notice-warning"><p>'.esc_html(implode(' ',$missing)).'</p></div>'; }
        });
        if(defined('WP_CLI') && WP_CLI) { \WP_CLI::add_command('fashiongate import',[self::class,'import']); }
    }
    public static function import($args,$assoc): void {
        if(!did_action('elementor/loaded')) { \WP_CLI::error('Activate Elementor first.'); }
        $files=glob(FG_EXPERIENCE_PATH.'templates/*.json');
        foreach($files as $file) {
            $slug=basename($file,'.json');
            if($slug==='global-settings') { continue; }
            $existing=get_posts(['post_type'=>'elementor_library','post_status'=>'any','meta_key'=>'_fg_template_key','meta_value'=>$slug,'numberposts'=>1]);
            $raw=str_replace('https://www.fashiongatemall.com/landing/wp-content/plugins/fashiongate-elementor-experience/',FG_EXPERIENCE_URL,file_get_contents($file));
            $data=json_decode($raw,true);
            if ($existing) {
                $id = $existing[0]->ID;
                wp_update_post(['ID' => $id, 'post_title' => $data['title']]);
            } else {
                $id = wp_insert_post(['post_type'=>'elementor_library','post_status'=>str_contains($slug,'draft')?'draft':'publish','post_title'=>$data['title']],true);
                if(is_wp_error($id)) { \WP_CLI::error($id->get_error_message()); }
            }
            update_post_meta($id,'_elementor_edit_mode','builder');
            update_post_meta($id,'_elementor_template_type',$data['type']);
            update_post_meta($id,'_elementor_version',ELEMENTOR_VERSION);
            update_post_meta($id,'_elementor_data',wp_slash(wp_json_encode($data['content'])));
            update_post_meta($id,'_elementor_page_settings',$data['page_settings']??[]);
            update_post_meta($id,'_fg_template_key',$slug);
            wp_set_object_terms($id,$data['type'],'elementor_library_type');
            \WP_CLI::success(($existing ? 'Updated ' : 'Imported ').$data['title']);
        }
        if(isset($assoc['globals'])) {
            $kit=\Elementor\Plugin::$instance->kits_manager->get_active_kit();
            if(!current_user_can('edit_post',$kit->get_id())) { \WP_CLI::error('Run globals import with --user=<administrator login>.'); }
            $settings=json_decode(file_get_contents(FG_EXPERIENCE_PATH.'templates/global-settings.json'),true);
            $kit->update_settings($settings['page_settings']);
            \WP_CLI::success('Applied Fashion Gate global kit settings.');
        }
    }
}
