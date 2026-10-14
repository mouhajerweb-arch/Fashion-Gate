<?php
$template_post = get_posts([
    'post_type'   => 'elementor_library',
    'meta_key'    => '_fg_template_key',
    'meta_value'  => 'immersive-landing-en',
    'numberposts' => 1
]);

if (empty($template_post)) {
    WP_CLI::error('Template immersive-landing-en not found.');
}

$template_id = $template_post[0]->ID;

$landing_post = get_posts([
    'post_type'   => 'page',
    'name'        => 'landing',
    'numberposts' => 1
]);

if (empty($landing_post)) {
    WP_CLI::error('Landing page not found.');
}

$landing_id = $landing_post[0]->ID;

$data = get_post_meta($template_id, '_elementor_data', true);
$settings = get_post_meta($template_id, '_elementor_page_settings', true);

update_post_meta($landing_id, '_elementor_data', wp_slash($data));
update_post_meta($landing_id, '_elementor_edit_mode', 'builder');
update_post_meta($landing_id, '_wp_page_template', 'elementor_canvas');
update_post_meta($landing_id, '_elementor_page_settings', $settings);

WP_CLI::success("Applied template {$template_id} (immersive-landing-en) to landing page {$landing_id} with Elementor Canvas.");
