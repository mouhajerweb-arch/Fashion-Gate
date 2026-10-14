<?php
if (!did_action('elementor/loaded')) {
    WP_CLI::error('Elementor not loaded');
}

delete_post_meta(42, '_elementor_css');
delete_post_meta(42, '_elementor_controls_usage');
update_post_meta(42, '_elementor_version', ELEMENTOR_VERSION);

// Delete all elementor css files from wp-content/uploads/elementor/css/
$css_dir = WP_CONTENT_DIR . '/uploads/elementor/css/';
if (is_dir($css_dir)) {
    $files = glob($css_dir . '*.css');
    foreach ($files as $file) {
        @unlink($file);
    }
}

if (isset(\Elementor\Plugin::$instance->files_manager)) {
    \Elementor\Plugin::$instance->files_manager->clear_cache();
}

WP_CLI::success("Flushed all Elementor CSS and page cache for landing page.");
