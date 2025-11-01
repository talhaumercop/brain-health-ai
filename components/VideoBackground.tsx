import React from 'react';

type Props = { src?: string };

export default function VideoBackground({ src = '/forest-loop.mp4' }: Props) {
  return (
    <div className="relative w-full h-full">
      <video
        className="w-full h-full object-cover brightness-90 rounded-3xl"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onLoadedData={() => console.debug('Video loaded:', src)}
        onError={(e) => console.error('Video error', e)}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
