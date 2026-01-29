import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { VideoFeed } from '@/lib/index';

interface VideoPlayerProps {
  video: VideoFeed;
  isActive: boolean;
  onVideoEnd: () => void;
}

export function VideoPlayer({ video, isActive, onVideoEnd }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showPlayIcon, setShowPlayIcon] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Autoplay blocked or failed:", error);
              setIsPlaying(false);
            });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowPlayIcon(true);
        setTimeout(() => setShowPlayIcon(false), 800);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
        setShowPlayIcon(true);
        setTimeout(() => setShowPlayIcon(false), 800);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div 
      className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden touch-none"
      onClick={togglePlay}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.videoUrl}
        poster={video.thumbnailUrl}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        onEnded={onVideoEnd}
      />

      {/* Play/Pause Animated Feedback */}
      <AnimatePresence>
        {showPlayIcon && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="absolute z-20 pointer-events-none"
          >
            <div className="bg-black/30 backdrop-blur-sm p-6 rounded-full">
              {isPlaying ? (
                <Play className="w-12 h-12 text-white fill-white" />
              ) : (
                <Pause className="w-12 h-12 text-white fill-white" />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mute/Unmute Toggle Overlay */}
      <div className="absolute bottom-24 right-4 z-20">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleMute}
          className="p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </motion.button>
      </div>

      {/* Progress Bar (TikTok style) */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/20 z-30">
        {isActive && (
          <motion.div
            className="h-full bg-primary"
            initial={{ width: '0%' }}
            animate={isPlaying ? { width: '100%' } : { width: '0%' }}
            transition={{ 
              duration: videoRef.current?.duration || 15, 
              ease: 'linear', 
              repeat: Infinity 
            }}
          />
        )}
      </div>

      {/* Ambient Gradient Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none" />
    </div>
  );
}
