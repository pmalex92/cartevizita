import { useCallback, useEffect, useMemo, useRef } from 'react';
const ANIMATION_CONFIG = {
  SMOOTH_DURATION: 600,
  INITIAL_DURATION: 1500,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20
};
// Helper functions
const clamp = (value: number, min = 0, max = 100) =>
Math.min(Math.max(value, min), max);
const round = (value: number, precision = 3) =>
parseFloat(value.toFixed(precision));
const adjust = (
value: number,
fromMin: number,
fromMax: number,
toMin: number,
toMax: number) =>
round(toMin + (toMax - toMin) * (value - fromMin) / (fromMax - fromMin));
const easeInOutCubic = (x: number) =>
x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
export interface TiltAnimationProps {
  enableTilt: boolean;
  enableMobileTilt: boolean;
  mobileTiltSensitivity?: number;
}
export const useTiltAnimation = ({
  enableTilt,
  enableMobileTilt,
  mobileTiltSensitivity = 5
}: TiltAnimationProps) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const animationHandlers = useMemo(() => {
    if (!enableTilt) return null;
    let rafId: number | null = null;
    const updateCardTransform = (
    offsetX: number,
    offsetY: number,
    card: HTMLElement,
    wrap: HTMLElement) =>
    {
      const width = card.clientWidth;
      const height = card.clientHeight;
      const percentX = clamp(100 / width * offsetX);
      const percentY = clamp(100 / height * offsetY);
      const centerX = percentX - 50;
      const centerY = percentY - 50;
      const properties = {
        '--pointer-x': `${percentX}%`,
        '--pointer-y': `${percentY}%`,
        '--background-x': `${adjust(percentX, 0, 100, 35, 65)}%`,
        '--background-y': `${adjust(percentY, 0, 100, 35, 65)}%`,
        '--pointer-from-center': `${clamp(Math.hypot(percentY - 50, percentX - 50) / 50, 0, 1)}`,
        '--pointer-from-top': `${percentY / 100}`,
        '--pointer-from-left': `${percentX / 100}`,
        '--rotate-x': `${round(-(centerX / 5))}deg`,
        '--rotate-y': `${round(centerY / 4)}deg`
      };
      Object.entries(properties).forEach(([property, value]) => {
        wrap.style.setProperty(property, value);
      });
    };
    const createSmoothAnimation = (
    duration: number,
    startX: number,
    startY: number,
    card: HTMLElement,
    wrap: HTMLElement) =>
    {
      const startTime = performance.now();
      const targetX = wrap.clientWidth / 2;
      const targetY = wrap.clientHeight / 2;
      const animationLoop = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = clamp(elapsed / duration);
        const easedProgress = easeInOutCubic(progress);
        const currentX = adjust(easedProgress, 0, 1, startX, targetX);
        const currentY = adjust(easedProgress, 0, 1, startY, targetY);
        updateCardTransform(currentX, currentY, card, wrap);
        if (progress < 1) {
          rafId = requestAnimationFrame(animationLoop);
        }
      };
      rafId = requestAnimationFrame(animationLoop);
    };
    return {
      updateCardTransform,
      createSmoothAnimation,
      cancelAnimation: () => {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };
  }, [enableTilt]);
  const handlePointerMove = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;
      if (!card || !wrap || !animationHandlers) return;
      const rect = card.getBoundingClientRect();
      animationHandlers.updateCardTransform(
        event.clientX - rect.left,
        event.clientY - rect.top,
        card,
        wrap
      );
    },
    [animationHandlers]
  );
  const handlePointerEnter = useCallback(() => {
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap || !animationHandlers) return;
    animationHandlers.cancelAnimation();
    wrap.classList.add('active');
    card.classList.add('active');
  }, [animationHandlers]);
  const handlePointerLeave = useCallback(
    (event: PointerEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;
      if (!card || !wrap || !animationHandlers) return;
      animationHandlers.createSmoothAnimation(
        ANIMATION_CONFIG.SMOOTH_DURATION,
        event.offsetX,
        event.offsetY,
        card,
        wrap
      );
      wrap.classList.remove('active');
      card.classList.remove('active');
    },
    [animationHandlers]
  );
  const handleDeviceOrientation = useCallback(
    (event: DeviceOrientationEvent) => {
      const card = cardRef.current;
      const wrap = wrapRef.current;
      if (!card || !wrap || !animationHandlers) return;
      const { beta, gamma } = event;
      if (beta === null || gamma === null) return;
      animationHandlers.updateCardTransform(
        card.clientHeight / 2 + gamma * mobileTiltSensitivity,
        card.clientWidth / 2 +
        (beta - ANIMATION_CONFIG.DEVICE_BETA_OFFSET) * mobileTiltSensitivity,
        card,
        wrap
      );
    },
    [animationHandlers, mobileTiltSensitivity]
  );
  useEffect(() => {
    if (!enableTilt || !animationHandlers) return;
    const card = cardRef.current;
    const wrap = wrapRef.current;
    if (!card || !wrap) return;
    const handleClick = () => {
      if (!enableMobileTilt || location.protocol !== 'https:') return;
      if (typeof window.DeviceMotionEvent?.requestPermission === 'function') {
        window.DeviceMotionEvent.requestPermission().
        then((state) => {
          if (state === 'granted') {
            window.addEventListener(
              'deviceorientation',
              handleDeviceOrientation
            );
          }
        }).
        catch((err) => console.error(err));
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    };
    card.addEventListener('pointerenter', handlePointerEnter);
    card.addEventListener(
      'pointermove',
      handlePointerMove as unknown as EventListener
    );
    card.addEventListener(
      'pointerleave',
      handlePointerLeave as unknown as EventListener
    );
    card.addEventListener('click', handleClick);
    const initialX = wrap.clientWidth - ANIMATION_CONFIG.INITIAL_X_OFFSET;
    const initialY = ANIMATION_CONFIG.INITIAL_Y_OFFSET;
    animationHandlers.updateCardTransform(initialX, initialY, card, wrap);
    animationHandlers.createSmoothAnimation(
      ANIMATION_CONFIG.INITIAL_DURATION,
      initialX,
      initialY,
      card,
      wrap
    );
    return () => {
      card.removeEventListener('pointerenter', handlePointerEnter);
      card.removeEventListener(
        'pointermove',
        handlePointerMove as unknown as EventListener
      );
      card.removeEventListener(
        'pointerleave',
        handlePointerLeave as unknown as EventListener
      );
      card.removeEventListener('click', handleClick);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      animationHandlers.cancelAnimation();
    };
  }, [
  enableTilt,
  enableMobileTilt,
  animationHandlers,
  handlePointerMove,
  handlePointerEnter,
  handlePointerLeave,
  handleDeviceOrientation]
  );
  return { wrapRef, cardRef };
};