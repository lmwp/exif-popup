const exifCache = {};
const allElements = document.getElementsByTagName('*');

for (let i = 0; i < allElements.length; i++) {
  const element = allElements[i];

  // Check if element has a background image
  const backgroundImage = window.getComputedStyle(element).getPropertyValue('background-image');
  if (backgroundImage && backgroundImage !== 'none') {
    const imageUrl = backgroundImage.match(/url\(['"]?([^'"\(\)]+)['"]?\)/i)[1];
    if (/\.(jpe?g|png|gif)$/i.test(imageUrl)) {
      addExifPopupToElement(element, imageUrl);
    }
  }

  // Check if element is an image
  if (element.tagName.toLowerCase() === 'img') {
    const imageUrl = element.getAttribute('src');
    if (/\.(jpe?g|png|gif)$/i.test(imageUrl)) {
      addExifPopupToElement(element, imageUrl);
    }
  }
}

function addExifPopupToElement(element, imageUrl) {
  const attachmentId = getImageAttachmentId(imageUrl);
  if (attachmentId) {
    if (exifCache[attachmentId]) {
      chatgptDisplayExifPopup({
        pageX: element.getBoundingClientRect().right,
        pageY: element.getBoundingClientRect().bottom,
      }, exifCache[attachmentId]);
    } else {
      const ajaxUrl = exifPopupAjax.ajaxurl;
      const data = {
        action: 'exif_popup',
        attachment_id: attachmentId
      };
      const onSuccess = function (response) {
        if (response.success) {
          const exifData = response.data;
          exifCache[attachmentId] = exifData;
          chatgptDisplayExifPopup({
            pageX: element.getBoundingClientRect().right,
            pageY: element.getBoundingClientRect().bottom,
          }, exifData);
        }
      };
      $.post(ajaxUrl, data, onSuccess);
    }
  }
}

function getImageAttachmentId(imageUrl) {
  const match = imageUrl.match(/wp-image-(\d+)/);
  if (match && match[1]) {
    return match[1];
  }
  return null;
}

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