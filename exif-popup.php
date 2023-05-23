<?php
/*
Plugin Name: EXIF Popup
Plugin URI: https://example.com/exif-popup
Description: Displays EXIF information on mouseover of any <img> tag using AJAX. 
Version: 0.1
Author: Laurent MILLET
Author URI: https://example.com/
Text Domain = exif-popup
License: GPL2
*/
// Enqueue scripts
add_action('wp_enqueue_scripts', 'TD_exif_popup_enqueue_scripts');
function TD_exif_popup_enqueue_scripts() {
    wp_enqueue_script('exif-popup', plugin_dir_url(__FILE__) . '/js/exif-popup.js', array('jquery'), '1.0', true);
    wp_localize_script('exif-popup', 'exifPopupAjax', array('ajaxurl' => admin_url('admin-ajax.php')));

    // Add admin bar toggle button
    if (current_user_can('administrator') || current_user_can('testeur')) {
        wp_enqueue_script('exif-popup-admin', plugin_dir_url(__FILE__) . '/js/exif-popup-admin.js', array('jquery'), '1.0', true);
        wp_localize_script('exif-popup-admin', 'exifPopupAdminAjax', array(
            'ajaxurl' => admin_url('admin-ajax.php'),
            'state' => get_option('exif_popup_state', 'on')
        ));
    }
}

// AJAX handler
add_action('wp_ajax_exif_popup', 'TD_exif_popup_ajax_handler');
add_action('wp_ajax_nopriv_exif_popup', 'TD_exif_popup_ajax_handler');
function TD_exif_popup_ajax_handler() {
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
        wp_send_json_error(array('message' => __('Image data not found.', 'exif-popup')));
    }
}

// Enqueue CSS
add_action('wp_enqueue_scripts', 'TD_exif_popup_enqueue_styles');
function TD_exif_popup_enqueue_styles() {
    wp_enqueue_style('exif-popup', plugin_dir_url(__FILE__) . '/styles/exif-popup.css', array(), '1.0');

    // Add admin bar toggle button styles
    if (current_user_can('administrator') || current_user_can('testeur')) {
        wp_enqueue_style('exif-popup-admin', plugin_dir_url(__FILE__) . '/styles/exif-popup-admin.css', array(), '1.0');
    }
}

// Add admin bar toggle button
add_action('admin_bar_menu', 'TD_exif_popup_admin_bar_button', 999);
function TD_exif_popup_admin_bar_button($wp_admin_bar) {
    if (current_user_can('administrator') || current_user_can('testeur')) {
        $state = get_option('exif_popup_state', 'on');
        $icon = $state === 'on' ? 'dashicons-yes' : 'dashicons-no';

        $wp_admin_bar->add_node(array(
            'id' => 'exif-popup-toggle',
            'title' => '<span class="ab-icon ' . $icon . '"></span>',
            'href' => '#',
            'meta' => array('class' => 'exif-popup-toggle')
        ));
    }
}

// Save admin bar toggle state
add_action('wp_ajax_exif_popup_toggle_state', 'TD_exif_popup_toggle_state');
function TD_exif_popup_toggle_state() {
    if (current_user_can('administrator') || current_user_can('testeur')) {
        $state = $_POST['state'];
        update_option('exif_popup_state', $state);
        wp_send_json_success();
    } else {
        wp_send_json_error();
    }
}

