<?php
/*
Plugin Name: EXIF Popup
Plugin URI: https://example.com/exif-popup
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
