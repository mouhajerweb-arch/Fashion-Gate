<?php
require_once '/var/www/html/wp-load.php';

if (!defined('FG_EXPERIENCE_PATH')) {
    define('FG_EXPERIENCE_PATH', '/var/www/html/wp-content/plugins/fashiongate-elementor-experience/');
}
if (!defined('FG_EXPERIENCE_URL')) {
    define('FG_EXPERIENCE_URL', content_url('/plugins/fashiongate-elementor-experience/'));
}

echo "=== SYNCING LANDING PAGES ===\n";

// 1. Post 42 - English
$en_file = FG_EXPERIENCE_PATH . 'templates/immersive-landing-en.json';
if (file_exists($en_file)) {
    $raw_en = str_replace(
        'https://www.fashiongatemall.com/landing/wp-content/plugins/fashiongate-elementor-experience/',
        FG_EXPERIENCE_URL,
        file_get_contents($en_file)
    );
    $json_en = json_decode($raw_en, true);
    if (!empty($json_en['content'])) {
        wp_update_post([
            'ID' => 42,
            'post_title' => 'Fashion Gate Landing (English)',
            'post_name' => 'landing',
            'post_status' => 'publish'
        ]);
        update_post_meta(42, '_elementor_data', wp_slash(json_encode($json_en['content'])));
        update_post_meta(42, '_elementor_edit_mode', 'builder');
        update_post_meta(42, '_wp_page_template', 'elementor_canvas');
        if (!empty($json_en['page_settings'])) {
            update_post_meta(42, '_elementor_page_settings', $json_en['page_settings']);
        }
        delete_post_meta(42, '_elementor_css');
        echo "Post 42 (English) updated successfully with " . count($json_en['content']) . " elements.\n";
    }
} else {
    echo "ERROR: $en_file not found.\n";
}

// 2. Post 57 - Arabic
$ar_file = FG_EXPERIENCE_PATH . 'templates/immersive-landing-ar.json';
if (file_exists($ar_file)) {
    $raw_ar = str_replace(
        'https://www.fashiongatemall.com/landing/wp-content/plugins/fashiongate-elementor-experience/',
        FG_EXPERIENCE_URL,
        file_get_contents($ar_file)
    );
    $json_ar = json_decode($raw_ar, true);
    if (!empty($json_ar['content'])) {
        wp_update_post([
            'ID' => 57,
            'post_title' => 'Fashion Gate Landing (Arabic)',
            'post_name' => 'landing-ar',
            'post_status' => 'publish'
        ]);
        update_post_meta(57, '_elementor_data', wp_slash(json_encode($json_ar['content'])));
        update_post_meta(57, '_elementor_edit_mode', 'builder');
        update_post_meta(57, '_wp_page_template', 'elementor_canvas');
        if (!empty($json_ar['page_settings'])) {
            update_post_meta(57, '_elementor_page_settings', $json_ar['page_settings']);
        }
        delete_post_meta(57, '_elementor_css');
        echo "Post 57 (Arabic) updated successfully with " . count($json_ar['content']) . " elements.\n";
    }
} else {
    echo "ERROR: $ar_file not found.\n";
}

flush_rewrite_rules();
echo "Rewrite rules flushed.\n";
