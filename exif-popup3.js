jQuery(document).ready(function ($) {
    const exifCache = {};

    $('img[class*="wp-image-"], [style*="background-image"]').on('mouseenter', function (e) {
        const element = $(this);
        let attachmentId = '';

        if (element.is('img')) {
            attachmentId = element.attr('class').match(/wp-image-(\d+)/)[1];
        } else if (element.is('[style*="background-image"]')) {
            const backgroundImage = element.css('background-image');
            if (backgroundImage.indexOf('url') !== -1) {
                attachmentId = backgroundImage.match(/wp-image-(\d+)/)[1];
            }
        }

        if (attachmentId) {
            if (exifCache[attachmentId]) {
                chatgptDisplayExifPopup(e, exifCache[attachmentId]);
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
                            chatgptDisplayExifPopup(e, exifData);
                        }
                    }
                });
            }
        }
    });

    function chatgptDisplayExifPopup(e, exifData) {
        const popup = $('<div class="exif-popup"></div>');
        popup.css({
            position: 'absolute',
            left: e.pageX + 5,
            top: e.pageY + 5,
            background: 'white',
            border: '1px solid #ccc',
            padding: '5px',
            zIndex: 10000,
            //display: 'none'
        });

        popup.html(
            `<strong>${exifPopup.l10n.title}:</strong> ${exifData.title}<br>
            <strong>${exifPopup.l10n.width}:</strong> ${exifData.width}<br>
            <strong>${exifPopup.l10n.height}:</strong> ${exifData.height}<br>
            <strong>${exifPopup.l10n.file_size}:</strong> ${exifData.file_size}`
        );

        $('body').append(popup);
        popup.fadeIn(200);
    }

    $('img[class*="wp-image-"], [style*="background-image"]').on('mouseleave', function () {
        $('.exif-popup').remove();
    });
});
