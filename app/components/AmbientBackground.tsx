'use client';

import { useEffect, useState } from 'react';

const videoMapping: Record<string, string> = {
  'orange': 'https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4', // 温馨
  'earth': 'https://videos.pexels.com/video-files/3251458/3251458-hd_1920_1080_25fps.mp4', // 自然
  'cinnamon': 'https://videos.pexels.com/video-files/1721304/1721304-hd_1920_1080_25fps.mp4', // 温暖室内
  'salt': 'https://videos.pexels.com/video-files/3178487/3178487-hd_1920_1080_25fps.mp4', // 海洋
  'wool': 'https://videos.pexels.com/video-files/2630730/2630730-hd_1920_1080_25fps.mp4', // 柔软
  'wood': 'https://videos.pexels.com/video-files/3232538/3232538-hd_1920_1080_25fps.mp4', // 自然木纹
  'metal': 'https://videos.pexels.com/video-files/3259711/3259711-hd_1920_1080_25fps.mp4', // 冷峻城市
  'ceramic': 'https://videos.pexels.com/video-files/2630730/2630730-hd_1920_1080_25fps.mp4', // 温暖手作
};

export default function AmbientBackground({ interactionData }: { interactionData: any }) {
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    if (interactionData?.choice) {
      const url = videoMapping[interactionData.choice] || videoMapping['earth'];
      setVideoUrl(url);
    } else if (interactionData?.sense && interactionData.choice) {
      const key = interactionData.choice;
      const url = videoMapping[key] || videoMapping['earth'];
      setVideoUrl(url);
    } else {
      // 默认的自然视频
      setVideoUrl('https://videos.pexels.com/video-files/3251458/3251458-hd_1920_1080_25fps.mp4');
    }
  }, [interactionData]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {videoUrl && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}
      {/* 渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-50/80 via-white/60 to-slate-100/80"></div>
      {/* 呼吸效果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0 animate-pulse opacity-30"></div>
    </div>
  );
}