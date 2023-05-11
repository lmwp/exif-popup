jQuery(document).ready(function($) {
  const exifCache = {};

  $('img').on('mouseenter', function(e) {
      const img = $(this);
      const attachmentId = img.attr('data-attachment-id');

      if (attachmentId) {
          if (exifCache[attachmentId]) {
              TDDisplayExifPopup(e, exifCache[attachmentId]);
          } else {
              $.ajax({
                  url: exifPopupAjax.ajaxurl,
                  method: 'POST',
                  data: {
                      action: 'exif_popup',
                      attachment_id: attachmentId
                  },
                  success: function(response) {
                      if (response.success) {
                          const exifData = response.data;
                          exifCache[attachmentId] = exifData;
                          TDDisplayExifPopup(e, exifData);
                      }
                  }
              });
          }
      }
  });

  function TDDisplayExifPopup(e, exifData) {
      const popup = $('<div class="exif-popup"></div>');
      popup.css({
          position: 'absolute',
          left: e.pageX + 5,
          top: e.pageY + 5,
          background: 'white',
          'border-radius': '3px',
          border: '1px solid #ccc',
          padding: '5px',
          zIndex: 10000,
          display: 'none'
      });

      popup.html(
          `Title: ${exifData.title}<br>
          Width: ${exifData.width}<br>
          Height: ${exifData.height}<br>
          File Size: ${exifData.file_size}`
      );

      $('body').append(popup);
      popup.fadeIn(200);
  }

  $('img').on('mouseleave', function() {
      $('.exif-popup').remove();
  });
});
