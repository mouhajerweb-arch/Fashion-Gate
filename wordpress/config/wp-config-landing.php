<?php
/** Include from wp-config.php BEFORE wp-settings.php. Secrets come from hosting. */
if (!defined('ABSPATH')) { exit; }
$fg_public = rtrim((string) getenv('FG_PUBLIC_URL'), '/');
$fg_secret = (string) getenv('FG_PROXY_SECRET');
if (!$fg_public || parse_url($fg_public, PHP_URL_SCHEME) !== 'https' || strlen($fg_secret) < 32) {
    http_response_code(503); exit('Landing configuration unavailable.');
}
if (PHP_SAPI !== 'cli' && (!isset($_SERVER['HTTP_X_FG_PROXY_TOKEN']) || !hash_equals($fg_secret, $_SERVER['HTTP_X_FG_PROXY_TOKEN']))) {
    header('X-Robots-Tag: noindex, nofollow'); http_response_code(403); exit('Forbidden');
}
define('WP_HOME', $fg_public);
define('WP_SITEURL', $fg_public);
define('FORCE_SSL_ADMIN', true);
define('DISALLOW_FILE_EDIT', true);
define('WP_POST_REVISIONS', 30);
define('COOKIEPATH', '/landing/');
define('SITECOOKIEPATH', '/landing/');
// Verified proxy credential, not an untrusted forwarded-proto header.
if (PHP_SAPI !== 'cli') { $_SERVER['HTTPS'] = 'on'; $_SERVER['SERVER_PORT'] = 443; }
unset($fg_public, $fg_secret);
