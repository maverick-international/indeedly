<?php

namespace Indeedly\Handlers;

use Indeedly\Setup\Plugin;
use Indeedly\Crawl\Spider;
use RoachPHP\Roach;
use RoachPHP\Spider\Configuration\Overrides;

class Crawl
{

    /**
     * Let's scrape.
     *
     * @return void
     */
    public static function scrape_jobs(): void
    {
        $plugin = new Plugin;

        $indeed_url = $plugin->get_indeed_url();

        if ($indeed_url) {
            Roach::startSpider(
                Spider::class,
                new Overrides(startUrls: [$indeed_url])
            );

            echo "<div class='updated notice'><p>Jobs added successfully!</p></div>";
        }
    }
}
