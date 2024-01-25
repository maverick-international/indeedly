<?php

namespace Indeedly\API;

class Jobs
{
    public function get_file()
    {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        global $wp_filesystem;

        $upload_dir = wp_upload_dir();

        $dir = trailingslashit($upload_dir['basedir']) . 'indeedly/';

        $file = $dir . "/indeedly.json";

        WP_Filesystem();

        if (!$wp_filesystem->exists($dir)) {
            return false;
        }

        return $wp_filesystem->get_contents($file);
    }

    public function parse_jobs()
    {
        $file = $this->get_file();

        if ($file) {
            $decoded_file = json_decode($file);

            return $decoded_file->posts;
        } else {
            return false;
        }
    }
}
