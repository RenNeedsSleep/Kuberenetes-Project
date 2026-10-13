import { useEffect, useRef } from 'react';

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const cursor = cursorRef.current;
    if (!cursor) return;

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { ...target };
    let visible = false;
    let enlarged = false;
    let frame = 0;

    const updateCursor = () => {
      const ease = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0.35 : 0.18;
      current.x += (target.x - current.x) * ease;
      current.y += (target.y - current.y) * ease;
      cursor.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) scale(${enlarged ? 2.5 : 1})`;
      cursor.style.opacity = visible ? '1' : '0';
      frame = window.requestAnimationFrame(updateCursor);
    };

    const handlePointerMove = (event: PointerEvent) => {
      target.x = event.clientX;
      target.y = event.clientY;
      visible = true;
      enlarged = event.target instanceof Element && Boolean(event.target.closest('a, button, [role="button"]'));
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) visible = false;
    };

    frame = window.requestAnimationFrame(updateCursor);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerout', handlePointerOut, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerout', handlePointerOut);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
};
