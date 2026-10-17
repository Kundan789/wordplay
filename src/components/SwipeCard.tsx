import React, { useState, useRef, useEffect } from 'react';
import { WordCard } from '../types';
import { CardFront } from './CardFront';
import { CardBack } from './CardBack';

interface SwipeCardProps {
  card: WordCard;
  isTop: boolean;
  onSwipe: (direction: 'left' | 'right') => void;
  isFlipped?: boolean;
  onFlipCard?: () => void;
  forcedDirection?: 'left' | 'right' | null;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  card,
  isTop,
  onSwipe,
  isFlipped = false,
  onFlipCard,
  forcedDirection
}) => {
  const [localFlipped, setLocalFlipped] = useState(isFlipped);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyOutDirection, setFlyOutDirection] = useState<'left' | 'right' | null>(null);

  // Sync external flip state if provided
  useEffect(() => {
    setLocalFlipped(isFlipped);
  }, [isFlipped]);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const totalMovedRef = useRef(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => {
    if (onFlipCard) {
      onFlipCard();
    } else {
      setLocalFlipped((prev) => !prev);
    }
  };

  // Trigger programmatic swipe (e.g. from bottom control buttons)
  useEffect(() => {
    if (forcedDirection && isTop) {
      setFlyOutDirection(forcedDirection);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(25); } catch (e) {}
      }
      const timer = setTimeout(() => {
        onSwipe(forcedDirection);
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [forcedDirection, isTop, onSwipe]);

  // Pointer Down (Mouse or Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isTop || flyOutDirection) return;

    const target = e.target as HTMLElement;

    // Check if clicked button, interactive child, or scrollable text area on card back
    if (
      target.closest('button') ||
      target.closest('[data-no-drag="true"]') ||
      (localFlipped && target.closest('[data-scrollable="true"]'))
    ) {
      return;
    }

    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    totalMovedRef.current = 0;

    if (cardRef.current) {
      try {
        cardRef.current.setPointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  // Pointer Move
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !isTop || flyOutDirection) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;
    totalMovedRef.current = Math.hypot(deltaX, deltaY);

    setDragOffset({ x: deltaX, y: deltaY });
  };

  // Pointer Up / End
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !isTop) return;
    setIsDragging(false);

    if (cardRef.current && cardRef.current.hasPointerCapture(e.pointerId)) {
      try {
        cardRef.current.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    const SWIPE_THRESHOLD = 90;

    if (dragOffset.x > SWIPE_THRESHOLD) {
      // Swiped Right -> Remember
      setFlyOutDirection('right');
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(25); } catch (e) {}
      }
      setTimeout(() => onSwipe('right'), 250);
    } else if (dragOffset.x < -SWIPE_THRESHOLD) {
      // Swiped Left -> Pass
      setFlyOutDirection('left');
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(20); } catch (e) {}
      }
      setTimeout(() => onSwipe('left'), 250);
    } else {
      // Snap back to center
      setDragOffset({ x: 0, y: 0 });

      // If user tapped/clicked without dragging, flip card!
      if (totalMovedRef.current < 7) {
        handleFlip();
      }
    }
  };

  // Card transform calculations
  let transform = '';
  let transition = isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

  if (flyOutDirection === 'right') {
    transform = 'translate3d(120vw, 30px, 0) rotate(26deg)';
    transition = 'transform 0.26s ease-in, opacity 0.26s ease-in';
  } else if (flyOutDirection === 'left') {
    transform = 'translate3d(-120vw, 30px, 0) rotate(-26deg)';
    transition = 'transform 0.26s ease-in, opacity 0.26s ease-in';
  } else if (isTop) {
    const rotation = dragOffset.x * 0.08;
    transform = `translate3d(${dragOffset.x}px, ${dragOffset.y * 0.4}px, 0) rotate(${rotation}deg)`;
  }

  // Stamp Opacities based on drag or programmatic swipe
  const isFlyRight = flyOutDirection === 'right';
  const isFlyLeft = flyOutDirection === 'left';

  const rememberOpacity = isTop
    ? isFlyRight
      ? 1
      : dragOffset.x > 20
      ? Math.min(1, (dragOffset.x - 20) / 70)
      : 0
    : 0;

  const passOpacity = isTop
    ? isFlyLeft
      ? 1
      : dragOffset.x < -20
      ? Math.min(1, (-dragOffset.x - 20) / 70)
      : 0
    : 0;

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{
        transform,
        transition,
        touchAction: localFlipped ? 'pan-y' : 'none'
      }}
      className={`absolute inset-0 w-full h-full perspective-1000 cursor-grab active:cursor-grabbing select-none ${
        flyOutDirection ? 'pointer-events-none' : ''
      }`}
    >
      {/* Dynamic Visual Badges / Stamps */}
      {isTop && rememberOpacity > 0 && (
        <div
          style={{ opacity: rememberOpacity }}
          className="absolute top-10 right-6 z-50 pointer-events-none transform rotate-12 transition-opacity"
        >
          <div className="border-4 border-emerald-400 bg-emerald-950/90 text-emerald-400 text-xl sm:text-2xl font-black px-4 py-1.5 rounded-2xl tracking-wider shadow-lg shadow-emerald-500/40 uppercase">
            REMEMBER 💚
          </div>
        </div>
      )}

      {isTop && passOpacity > 0 && (
        <div
          style={{ opacity: passOpacity }}
          className="absolute top-10 left-6 z-50 pointer-events-none transform -rotate-12 transition-opacity"
        >
          <div className="border-4 border-rose-500 bg-rose-950/90 text-rose-400 text-xl sm:text-2xl font-black px-4 py-1.5 rounded-2xl tracking-wider shadow-lg shadow-rose-500/40 uppercase">
            SKIP ✕
          </div>
        </div>
      )}

      {/* 3D Flip Container */}
      <div
        className={`w-full h-full relative transition-transform duration-500 transform-style-preserve-3d ${
          localFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of Card */}
        <div
          style={{
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)'
          }}
          className={`absolute inset-0 w-full h-full rounded-3xl bg-slate-900 ${
            localFlipped ? 'pointer-events-none' : ''
          }`}
        >
          <CardFront card={card} onFlip={handleFlip} />
        </div>

        {/* Back of Card */}
        <div
          style={{
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
          className={`absolute inset-0 w-full h-full rounded-3xl bg-slate-900 ${
            !localFlipped ? 'pointer-events-none' : ''
          }`}
        >
          <CardBack card={card} onFlip={handleFlip} />
        </div>
      </div>
    </div>
  );
};
