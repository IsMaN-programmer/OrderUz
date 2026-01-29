import { useState, useCallback, useMemo } from 'react';
import { mockVideoFeeds } from '@/data/index';
import { VideoFeed } from '@/lib/index';

export const useVideoFeed = () => {
  const [videos, setVideos] = useState<VideoFeed[]>(mockVideoFeeds);
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentVideo = useMemo(() => videos[currentIndex], [videos, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, videos.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const toggleLike = useCallback((videoId: string) => {
    setVideos((currentVideos) =>
      currentVideos.map((video) => {
        if (video.id === videoId) {
          const isLiked = !video.userHasLiked;
          return {
            ...video,
            userHasLiked: isLiked,
            likes: isLiked ? video.likes + 1 : Math.max(0, video.likes - 1),
          };
        }
        return video;
      })
    );
  }, []);

  const toggleSave = useCallback((videoId: string) => {
    setVideos((currentVideos) =>
      currentVideos.map((video) =>
        video.id === videoId
          ? { ...video, userHasSaved: !video.userHasSaved }
          : video
      )
    );
  }, []);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < videos.length) {
      setCurrentIndex(index);
    }
  }, [videos.length]);

  return {
    videos,
    currentIndex,
    currentVideo,
    handleNext,
    handlePrev,
    goToIndex,
    toggleLike,
    toggleSave,
    hasNext: currentIndex < videos.length - 1,
    hasPrev: currentIndex > 0,
  };
};