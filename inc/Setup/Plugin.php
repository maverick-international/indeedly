<?php

/**
 * Indeedly plugin file.
 *
 * @package Indeedly
 */

namespace Indeedly\Setup;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Sets up Indeedly
 */
class Plugin
{

    public static function get_indeed_url()
    {

        global $wpdb;

        $sql = "
            SELECT indeed_url, id
            FROM   {$wpdb->prefix}indeedly
        ";

        $results = $wpdb->get_results($sql);

        $last = end($results);

        if (!$last) {
            return;
        }

        return $last->indeed_url;
    }

    public static function install()
    {
        global $wpdb;

        $table_name = $wpdb->prefix . "indeedly";

        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
                id mediumint(9) NOT NULL AUTO_INCREMENT,
                time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
                indeed_url varchar(55) DEFAULT '' NOT NULL,
                PRIMARY KEY  (id)
                ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }
}
