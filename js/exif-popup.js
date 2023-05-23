jQuery(document).ready(function ($) {
    const exifCache = {};

    $('img[class*="wp-image-"]').on('mouseenter', function (e) {
        const img = $(this);
        const attachmentId = img.attr('class').match(/wp-image-(\d+)/)[1];

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
                    success: function (response) {
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
    // Traitement pour les images avec background-image
    $('div[class*="wp-image-"][style*=background-image]').on('mouseenter', function (e) {
        const elem = $(this);
        const bgImage = elem.css('background-image');
        const attachmentId = bgImage.match(/wp-image-(\d+)/);

        if (attachmentId && attachmentId[1]) {
            if (exifCache[attachmentId[1]]) {
                TDDisplayExifPopup(e, exifCache[attachmentId[1]]);
            } else {
                $.ajax({
                    url: exifPopupAjax.ajaxurl,
                    method: 'POST',
                    data: {
                        action: 'exif_popup',
                        attachment_id: attachmentId[1]
                    },
                    success: function (response) {
                        if (response.success) {
                            const exifData = response.data;
                            exifCache[attachmentId[1]] = exifData;
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

    $('img').on('mouseleave', function () {
        $('.exif-popup').remove();
    });
});
