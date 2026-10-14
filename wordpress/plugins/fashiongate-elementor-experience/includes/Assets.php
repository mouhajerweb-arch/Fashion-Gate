<?php
namespace FashionGate\ElementorExperience;
defined('ABSPATH') || exit;
final class Assets {
    public static function boot(): void {
        add_action('wp_enqueue_scripts', [self::class, 'register']);
        add_action('elementor/frontend/after_enqueue_scripts', [self::class, 'enqueue']);
    }
    public static function register(): void {
        $base = FG_EXPERIENCE_URL . 'assets/';
        wp_register_style('fg-lenis', $base.'vendor/lenis.css', [], '1.1.18');
        wp_register_style('fg-experience', $base.'css/frontend.css', ['fg-lenis'], '1.0.0');
        wp_register_script('fg-lenis', $base.'vendor/lenis.min.js', [], '1.1.18', true);
        wp_register_script('fg-gsap', $base.'vendor/gsap.min.js', [], '3.13.0', true);
        wp_register_script('fg-scrolltrigger', $base.'vendor/ScrollTrigger.min.js', ['fg-gsap'], '3.13.0', true);
        wp_register_script('fg-motion', $base.'js/motion-engine.js', ['fg-scrolltrigger'], '1.0.0', true);
        wp_register_script('fg-frontend', $base.'js/frontend.js', ['fg-gsap', 'fg-scrolltrigger', 'fg-lenis'], '1.0.0', true);
    }
    public static function enqueue(): void {
        self::register();
        wp_enqueue_style('fg-lenis');
        wp_enqueue_style('fg-experience');
        wp_enqueue_script('fg-lenis');
        wp_enqueue_script('fg-motion');
        wp_enqueue_script('fg-frontend');
        $breakpoints = \Elementor\Plugin::$instance->breakpoints->get_active_breakpoints();
        wp_localize_script('fg-motion', 'fgMotion', [
            'mobile'=>(int)($breakpoints['mobile']->get_value() ?? 767),
            'tablet'=>(int)($breakpoints['tablet']->get_value() ?? 1024),
        ]);
        wp_localize_script('fg-frontend', 'fgExperience', [
            'endpoint'=>esc_url_raw(rest_url('fashiongate/v1/leads')),
            'challenge'=>esc_url_raw(rest_url('fashiongate/v1/challenge')),
            'pageId'=>get_queried_object_id(),
            'canonical'=>get_permalink(get_queried_object_id()),
            'ga4'=>preg_match('/^G-[A-Z0-9]+$/',(string)getenv('FG_GA4_ID'))?(string)getenv('FG_GA4_ID'):'',
            'turnstile'=>(string)getenv('FG_TURNSTILE_SITE_KEY'),
            'language'=>function_exists('pll_current_language') ? pll_current_language('slug') : (is_rtl()?'ar':'en'),
        ]);
    }
}
