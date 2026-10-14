<?php
defined('ABSPATH') || exit;
add_action('wp_enqueue_scripts', static function () {
    wp_enqueue_style('fashiongate-foundation', get_stylesheet_uri(), ['astra-theme-css'], '1.0.0');
});
add_action('wp_body_open', static function () {
    echo '<a class="fg-skip" href="#fg-main">' . esc_html__('Skip to content', 'fashiongate') . '</a>';
});
add_action('elementor/theme/register_locations', static function ($manager) { $manager->register_all_core_location(); });
