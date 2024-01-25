<?php

/**
 * Indeedly plugin file.
 *
 * @package Indeedly
 */


namespace Indeedly\Handlers;

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Handles fom input
 */
class Form
{

    /**
     * Saves the chosen indeed url to the WP database.
     *
     * @param string $indeed_url
     * @return void
     */
    public function save_indeed_url_to_database($indeed_url)
    {
        if (!$indeed_url) {
            wp_die('Please add a url.');
        }

        $indeed_url = sanitize_text_field($indeed_url);

        global $wpdb;

        $table_name = $wpdb->prefix . 'indeedly';

        $wpdb->insert(
            $table_name,
            array(
                'time' => current_time('mysql'),
                'indeed_url' => $indeed_url,
            )
        );

        return "<div class='updated notice'><p>{$indeed_url} added successfully!</p></div>";
    }
}
