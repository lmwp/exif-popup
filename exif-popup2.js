jQuery(document).ready(function ($) {
    const exifCache = {};

    function displayExifPopup(e, exifData) {
        const popup = $('<div class="exif-popup"></div>');
        popup.css({
            position: 'absolute',
            left: e.pageX + 5,
            top: e.pageY + 5,
            background: 'white',
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

    function handleHover(e) {
        const target = $(e.target);
        let backgroundImageUrl = null;

        // Check if the target element has a background image set
        if (target.css('background-image') !== 'none') {
            backgroundImageUrl = target.css('background-image');
        } else if (target.is('img')) { // If not, check if the target element is an <img> tag
            backgroundImageUrl = target.attr('src');
        }

        if (backgroundImageUrl) {
            const attachmentIdMatch = backgroundImageUrl.match(/wp-image-(\d+)/);
            if (attachmentIdMatch) {
                const attachmentId = attachmentIdMatch[1];

                if (exifCache[attachmentId]) {
                    displayExifPopup(e, exifCache[attachmentId]);
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
                                displayExifPopup(e, exifData);
                            }
                        }
                    });
                }
            }
        }
    }

    $('body').on('mouseenter', handleHover);
    $('body').on('mouseleave', function () {
        $('.exif-popup').remove();
    });
});
