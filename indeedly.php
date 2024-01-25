<?php

/**
 * Indeedly plugin.
 *
 * @package Indeedly
 * @since 1.0.1
 *
 * @wordpress-plugin
 * Plugin Name: Indeedly
 * Plugin URI: https://www.mavericklabs.ie
 * Description: Displays Indeed listings in WordPress.
 * Version: 1.0.0
 * License: GPLv3
 * Text Domain: indeedly
 * Author: Maverick Labs <ops@maverick-intl.com>
 * Author URI: https://www.mavericklabs.ie
 */

use Indeedly\Setup\Admin;
use Indeedly\Setup\Plugin;
use Indeedly\Cron\Cron;
use Indeedly\Handlers\Crawl;

if (!defined('ABSPATH')) {
    exit;
}
require_once(ABSPATH . '/wp-includes/pluggable.php');
require_once __DIR__ . '/vendor/autoload.php';

if (!defined('INDEEDLY_PLUGIN_URL')) {
    define('INDEEDLY_PLUGIN_URL', plugin_dir_url(__FILE__));
}

if (!defined('INDEEDLY_PLUGIN_PATH')) {
    define('INDEEDLY_PLUGIN_PATH', plugin_dir_path(__FILE__));
}

define('INDEEDLY_CURRENT_VERSION', '1.0.0');

$admin = new Admin('Indeedly');

$admin->add_actions();
$admin->add_styles();

function initiate_jobs()
{
    Crawl::scrape_jobs();
}

function custom_plugin_function_event()
{
    if (wp_next_scheduled('indeedly_cron_hook') == false) {
        wp_schedule_event(time(), 'hourly', 'indeedly_cron_hook');
    }
    add_action('indeedly_cron_hook', 'initiate_jobs');
}

function indeedly_install()
{
    Plugin::install();
}

function indeedly_deactivate()
{
    Cron::deactivate();
}

add_action('init', 'custom_plugin_function_event');

register_activation_hook(__FILE__, 'indeedly_install');
register_deactivation_hook(__FILE__, 'indeedly_deactivate');
