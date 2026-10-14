<?php
$landing_post = get_posts([
    'post_type'   => 'page',
    'name'        => 'landing',
    'numberposts' => 1
]);

if (empty($landing_post)) {
    WP_CLI::error('Landing page not found.');
}

$landing_id = $landing_post[0]->ID;

$backup_id = wp_insert_post([
    'post_title'  => 'Fashion Gate Landing — Previous Version',
    'post_name'   => 'landing-previous-version',
    'post_type'   => 'page',
    'post_status' => 'draft'
]);

if (is_wp_error($backup_id)) {
    WP_CLI::error('Failed to create backup page.');
}

foreach (get_post_meta($landing_id) as $key => $vals) {
    foreach ($vals as $val) {
        add_post_meta($backup_id, $key, maybe_unserialize($val));
    }
}

WP_CLI::success("Backup created with ID: {$backup_id} ('Fashion Gate Landing — Previous Version').");
