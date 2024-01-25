<?php

/**
 * Indeedly plugin file.
 *
 * @package Indeedly
 */

use Indeedly\Handlers\Form;
use Indeedly\Handlers\Crawl;
use Indeedly\Setup\Plugin;

if (!defined('ABSPATH')) {
    exit;
}

function processForm()
{

    if (!isset($_POST['nonce_check']) || !wp_verify_nonce(wp_unslash($_POST['nonce_check']), 'indeedly')) {
        wp_die('Sorry, your nonce did not verify.', 'indeedly');
    }

    if (!isset($_POST['indeed_url'])) {
        wp_die('no dice');
    }

    if (isset($_POST['indeed_url'])) {

        $form = new Form();

        echo $form->save_indeed_url_to_database($_POST['indeed_url']);
    }
}

function processCrawl()
{
    if (!isset($_POST['nonce_check_two']) || !wp_verify_nonce(wp_unslash($_POST['nonce_check_two']), 'indeedly')) {
        wp_die('Sorry, your nonce did not verify.', 'indeedly');
    }
    Crawl::scrape_jobs();
}

if (isset($_SERVER['REQUEST_METHOD']) && 'POST' == $_SERVER['REQUEST_METHOD']) {

    if (isset($_POST['indeed_url'])) {
        processForm();
    }

    if (isset($_POST['get_jobs'])) {
        processCrawl();
    }
}

$original_indeed_url = Plugin::get_indeed_url();

?>

<div class="indeedly-admin">
    <div class="indeedly-admin__content">
        <h1 class="wp-heading-inline">Indeedly</h1>
        <h5><?php echo $original_indeed_url; ?></h5>
        <form id="indeedly_form" name="indeedly_form" method="post" action="">
            <?php wp_nonce_field('indeedly', 'nonce_check'); ?>
            <table class="widefat">
                <thead>
                    <tr>
                        <th class="manage-column" style="width: 250px;">
                            <?php esc_html_e('Option', 'indeedly'); ?>
                        </th>
                        <th colspan="3" class="manage-column">
                            <?php esc_html_e('Setting', 'indeedly'); ?>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="alternate iedit">
                        <td valign="top">
                            <?php esc_html_e('Indeed Url', 'indeedly'); ?>
                        </td>
                        <td colspan="2">
                            <input type="url" name="indeed_url" required>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class=" indeedly-admin__form__submit">
                <input type="submit" name="submit" value="<?php esc_html_e('Add Url', 'indeedly'); ?>" class="button-primary">
            </div>
        </form>
        <h4>Get Jobs From Indeed Now</h4>
        <form action="" method="post">
            <?php wp_nonce_field('indeedly', 'nonce_check_two'); ?>
            <input type="submit" name="get_jobs" value="Let's Gooooo" class="button-primary" />
        </form>
    </div>
</div>
