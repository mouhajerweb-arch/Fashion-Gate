<?php
/**
 * Plugin Name: Fashion Gate Elementor Experience
 * Description: Editable campaign widgets, progressive motion and secure lead delivery.
 * Version: 1.0.0
 * Requires at least: 6.6
 * Requires PHP: 8.1
 * Requires Plugins: elementor
 * Text Domain: fashiongate
 */
namespace FashionGate\ElementorExperience;
defined('ABSPATH') || exit;
define('FG_EXPERIENCE_PATH', plugin_dir_path(__FILE__));
define('FG_EXPERIENCE_URL', plugin_dir_url(__FILE__));
require_once FG_EXPERIENCE_PATH . 'includes/Leads.php';
require_once FG_EXPERIENCE_PATH . 'includes/Platform.php';
register_activation_hook(__FILE__, [Platform::class, 'activate']);
register_deactivation_hook(__FILE__, static function () { wp_clear_scheduled_hook('fg_cleanup_gates'); });
add_action('plugins_loaded', static function () {
    Platform::boot();
    Leads::boot();
    if (!did_action('elementor/loaded')) {
        add_action('admin_notices', static function () { echo '<div class="notice notice-warning"><p>Fashion Gate requires Elementor.</p></div>'; });
        return;
    }
    require_once FG_EXPERIENCE_PATH . 'includes/MotionControls.php';
    require_once FG_EXPERIENCE_PATH . 'includes/Assets.php';
    MotionControls::boot();
    Assets::boot();
    add_action('elementor/widgets/register', static function ($manager) {
        require_once FG_EXPERIENCE_PATH . 'widgets/ExperienceWidget.php';
        foreach (ExperienceWidget::KINDS as $kind => $label) { $manager->register(new ExperienceWidget([], null, $kind)); }
    });
    add_action('elementor/elements/categories_registered', static function ($manager) {
        $manager->add_category('fashiongate', ['title' => 'Fashion Gate', 'icon' => 'eicon-star']);
    });
});
