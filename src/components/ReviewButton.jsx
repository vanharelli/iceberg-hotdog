import React from 'react';

export default function ReviewButton() {
  const reviewUrl = 'https://search.google.com/local/writereview?placeid=ChIJyTRCS3wvWpMRedEofRDc8QY';

  return (
    <a
      href={reviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-google-review fixed right-6 bottom-20 z-[100] max-w-[260px]"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Maps_icon_%282020%29.svg"
        alt="Google Maps"
        className="google-icon"
      />
      Avalie-nos no Google
    </a>
  );
}

