<?php

namespace Indeedly\Crawl;

use RoachPHP\Http\Response;
use RoachPHP\Spider\BasicSpider;
use Indeedly\Handlers\Crawl;
use Indeedly\Cron\Cron;

class Spider extends BasicSpider
{

    /**
     * @var string[]
     */
    public array $startUrls = [
        'https://roach-php.dev/docs/spiders'
    ];


    /**
     * Parses the page.
     *
     * @param Response $response
     * @return \Generator
     */
    public function parse(Response $response): \Generator
    {

        $content = 'default';

        if ($response->filter('body')->count() > 0) {

            $content = $response
                ->filter('body')
                ->text();

            $this->save($content);
        }

        yield $this->item([
            'content' => $content,
        ]);
    }



    private function save($json)
    {
        require_once(ABSPATH . 'wp-admin/includes/file.php');
        global $wp_filesystem;


        $upload_dir = wp_upload_dir();

        $dir = trailingslashit($upload_dir['basedir']) . 'indeedly/';

        $file = $dir . "/indeedly.json";

        WP_Filesystem();

        if (!$wp_filesystem->is_dir($dir)) {
            $wp_filesystem->mkdir($dir);
        }

        $wp_filesystem->put_contents($file, $json, 0644);
    }
}
