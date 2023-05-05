<?php
/*
Plugin Name: EXIF Popup
Plugin URI: https://example.com/plugins/billetweb-api/
Description: Displays EXIF information on mouseover of any <img> tag using AJAX. 
Version: 0.1
Author: Laurent MILLET
Author URI: https://example.com/
Text domain = exif-popup
License: GPL2
*/

// Enqueue scripts
add_action('wp_enqueue_scripts', 'chatgpt_exif_popup_enqueue_scripts');
function chatgpt_exif_popup_enqueue_scripts() {
    wp_enqueue_script('exif-popup', plugin_dir_url(__FILE__) . 'exif-popup.js', array('jquery'), '1.0', true);
    wp_localize_script('exif-popup', 'exifPopupAjax', array('ajaxurl' => admin_url('admin-ajax.php')));
}

// AJAX handler
add_action('wp_ajax_exif_popup', 'chatgpt_exif_popup_ajax_handler');
add_action('wp_ajax_nopriv_exif_popup', 'chatgpt_exif_popup_ajax_handler');
function chatgpt_exif_popup_ajax_handler() {
    $attachment_id = intval($_POST['attachment_id']);
    $image_data = wp_get_attachment_metadata($attachment_id);

    if ($image_data) {
        $response = array(
            'width' => $image_data['width'],
            'height' => $image_data['height'],
            'file_size' => size_format(filesize(get_attached_file($attachment_id)), 2),
            'title' => get_the_title($attachment_id)
        );
        wp_send_json_success($response);
    } else {
        wp_send_json_error(array('message' => 'Image data not found.'));
    }
}

// Enqueue CSS
add_action('wp_enqueue_scripts', 'chatgpt_exif_popup_enqueue_styles');
function chatgpt_exif_popup_enqueue_styles() {
    wp_enqueue_style('exif-popup', plugin_dir_url(__FILE__) . 'exif-popup.css', array(), '1.0');
}
// Add plugin options page
add_action('admin_menu', 'chatgpt_exif_popup_options_page');
function chatgpt_exif_popup_options_page() {
    add_menu_page(
        'EXIF Popup Options', // Page title
        'EXIF Popup', // Menu title
        'manage_options', // Capability required to access the page
        'exif-popup-options', // Menu slug
        'chatgpt_exif_popup_options_callback', // Callback function to render the page
        'dashicons-format-image', // Icon URL
        100 // Position in the menu
    );
}

// Render options page
function chatgpt_exif_popup_options_callback() {
    // Check if user has permission to access the page
    if (!current_user_can('manage_options')) {
        wp_die(__('You do not have sufficient permissions to access this page.'));
    }

    // Get current option value
    $enabled = get_option('chatgpt_exif_popup_enabled');

    // Handle form submission
    if (isset($_POST['chatgpt_exif_popup_submit'])) {
        $enabled = isset($_POST['chatgpt_exif_popup_enabled']) ? 1 : 0;
        update_option('chatgpt_exif_popup_enabled', $enabled);
        echo '<div class="updated"><p>Options saved.</p></div>';
    }

    // Render options form
    ?>
    <div class="wrap">
        <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
        <form method="post" action="">
            <table class="form-table">
                <tbody>
                    <tr>
                        <th scope="row">Enable EXIF Popup</th>
                        <td><label><input type="checkbox" name="chatgpt_exif_popup_enabled" value="1" <?php checked(1, $enabled); ?>> Enabled</label></td>
                    </tr>
                </tbody>
            </table>
            <p class="submit"><input type="submit" name="chatgpt_exif_popup_submit" class="button-primary" value="Save Changes"></p>
        </form>
    </div>
    <?php
}

// Initialize default option value
add_option('chatgpt_exif_popup_enabled', 1);
