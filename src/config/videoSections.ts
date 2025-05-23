import { TEXT_ANIMATIONS, VIDEO_POSITIONS } from '../components/video/LazyVideoSection';
import { VideoSection } from '../components/video/SnapScrollVideoSection';

export const videoSections: VideoSection[] = [
  {
    id: 'intro',
    title: 'Welcome To Lapis Visuals',
    subtitle: 'Layered Stories. Crafted Visuals',
    videoSrc: { src: '/videos/Lapis_Visual (1).mp4', type: 'video/mp4' },
    mobileSrc: { src: '/videos/LAVI_Vertical.mp4', type: 'video/mp4' },
    textPosition: VIDEO_POSITIONS.CENTER,
    textColor: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    textAnimation: TEXT_ANIMATIONS.TYPEWRITER,
    textAnimationOptions: {
      duration: 1,
      delay: 0,
      cursor: true,
      cursorChar: '|',
      cursorColor: '#ffffff',
      cursorStyle: 'blink',
      cursorBlinkSpeed: 0.5,
      randomize: true,
      speedVariation: 0.6,
      pauseProbability: 0.4,
      maxPauseDuration: 0.1
    }
  }
]; 