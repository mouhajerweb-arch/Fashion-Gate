<?php
$json_file = FG_EXPERIENCE_PATH . 'templates/immersive-landing-en.json';

if (!file_exists($json_file)) {
    WP_CLI::error("Template file $json_file not found.");
}

$raw = str_replace(
    'https://www.fashiongatemall.com/landing/wp-content/plugins/fashiongate-elementor-experience/',
    FG_EXPERIENCE_URL,
    file_get_contents($json_file)
);

$json = json_decode($raw, true);

if (empty($json['content'])) {
    WP_CLI::error("Invalid JSON content in $json_file");
}

$landing_post = get_posts([
    'post_type'   => 'page',
    'name'        => 'landing',
    'numberposts' => 1
]);

if (empty($landing_post)) {
    WP_CLI::error('Landing page not found.');
}

$landing_id = $landing_post[0]->ID;

update_post_meta($landing_id, '_elementor_data', wp_slash(json_encode($json['content'])));
update_post_meta($landing_id, '_elementor_edit_mode', 'builder');
update_post_meta($landing_id, '_wp_page_template', 'elementor_canvas');
if (!empty($json['page_settings'])) {
    update_post_meta($landing_id, '_elementor_page_settings', $json['page_settings']);
}

delete_post_meta($landing_id, '_elementor_css');

WP_CLI::success("Applied template from {$json_file} to landing page {$landing_id} successfully.");
