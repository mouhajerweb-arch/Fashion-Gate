<?php
require_once '/var/www/html/wp-load.php';

echo "=== LOCALE SOURCE DEBUG ===\n";
echo "get_option('WPLANG'): " . var_export(get_option('WPLANG'), true) . "\n";
echo "get_locale(): " . get_locale() . "\n";
echo "sanitize_key(get_locale()): " . sanitize_key(get_locale()) . "\n";
$trace = debug_backtrace();

$_SERVER['REQUEST_URI'] = '/wp-admin/';
wp_set_current_user(1);
echo "Admin user locale: " . get_user_locale(1) . "\n";
echo "Admin locale filter: " . apply_filters('admin_locale', get_locale()) . "\n";

$users = get_users();
echo "\n=== USERS ===\n";
foreach ($users as $u) {
    echo "User ID: {$u->ID}, login: {$u->user_login}, locale: " . get_user_meta($u->ID, 'locale', true) . "\n";
}

echo "\n=== ALL PAGES ===\n";
$pages = get_posts(['post_type' => 'page', 'numberposts' => -1, 'post_status' => 'any']);
foreach ($pages as $p) {
    $edit_mode = get_post_meta($p->ID, '_elementor_edit_mode', true);
    $data = get_post_meta($p->ID, '_elementor_data', true);
    $len = is_string($data) ? strlen($data) : (is_array($data) ? count($data) : 0);
    echo "ID: {$p->ID} | slug: {$p->post_name} | status: {$p->post_status} | title: {$p->post_title} | edit_mode: {$edit_mode} | elementor_data len: {$len}\n";
}

echo "\n=== POST 57 DETAILS ===\n";
$p57 = get_post(57);
if ($p57) {
    echo "Post 57 Title: {$p57->post_title}\n";
    echo "Post 57 Slug: {$p57->post_name}\n";
    echo "Post 57 Template: " . get_post_meta(57, '_wp_page_template', true) . "\n";
    $p57_data = get_post_meta(57, '_elementor_data', true);
    if ($p57_data) {
        $p57_json = is_string($p57_data) ? json_decode($p57_data, true) : $p57_data;
        echo "Post 57 Elementor Elements Count: " . (is_array($p57_json) ? count($p57_json) : 0) . "\n";
        echo "Post 57 Element types: ";
        if (is_array($p57_json)) {
            $types = [];
            array_walk_recursive($p57_json, function($val, $key) use (&$types) {
                if ($key === 'widgetType') $types[] = $val;
            });
            echo implode(', ', array_unique($types)) . "\n";
        }
    } else {
        echo "Post 57 has NO _elementor_data!\n";
    }
} else {
    echo "Post 57 does not exist!\n";
}

echo "\n=== POST 42 DETAILS ===\n";
$p42 = get_post(42);
if ($p42) {
    echo "Post 42 Title: {$p42->post_title}\n";
    echo "Post 42 Slug: {$p42->post_name}\n";
    echo "Post 42 Template: " . get_post_meta(42, '_wp_page_template', true) . "\n";
    $p42_data = get_post_meta(42, '_elementor_data', true);
    if ($p42_data) {
        $p42_json = is_string($p42_data) ? json_decode($p42_data, true) : $p42_data;
        echo "Post 42 Elementor Elements Count: " . (is_array($p42_json) ? count($p42_json) : 0) . "\n";
        echo "Post 42 Element types: ";
        if (is_array($p42_json)) {
            $types = [];
            array_walk_recursive($p42_json, function($val, $key) use (&$types) {
                if ($key === 'widgetType') $types[] = $val;
            });
            echo implode(', ', array_unique($types)) . "\n";
        }
    }
}

