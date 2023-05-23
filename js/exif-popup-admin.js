jQuery(document).ready(function($) {
    // Toggle state on click
    $('.exif-popup-toggle').on('click', function(e) {
      e.preventDefault();
      var state = $(this).hasClass('dashicons-yes') ? 'off' : 'on';
  
      $.ajax({
        url: exifPopupAdminAjax.ajaxurl,
        type: 'POST',
        data: {
          action: 'exif_popup_toggle_state',
          state: state,
        },
        success: function(response) {
          if (state === 'on') {
            $('.exif-popup-toggle').removeClass('dashicons-no').addClass('dashicons-yes');
          } else {
            $('.exif-popup-toggle').removeClass('dashicons-yes').addClass('dashicons-no');
          }
        },
        error: function() {
          console.log('An error occurred');
        }
      });
    });
  });
  