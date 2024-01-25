<?php

namespace Indeedly\Cron;

class Cron
{
    public static function deactivate()
    {
        $timestamp = wp_next_scheduled('indeedly_cron_hook');
        wp_unschedule_event($timestamp, 'indeedly_cron_hook');
    }
}
