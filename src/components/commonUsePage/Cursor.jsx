import React,{useRef,useEffect} from 'react'


export default function Cursor() {
    const cursorRef = useRef(null);
    const dotRef = useRef(null);
    const posRef = useRef({ x: 0, y: 0 });
    const targetRef = useRef({ x: 0, y: 0 });
  
    useEffect(() => {
      const move = (e) => {
        targetRef.current = { x: e.clientX, y: e.clientY };
      };
      window.addEventListener("mousemove", move);
  
      let raf;
      const animate = () => {
        posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.08;
        posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.08;
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${posRef.current.x - 20}px, ${posRef.current.y - 20}px)`;
        }
        if (dotRef.current) {
          dotRef.current.style.transform = `translate(${targetRef.current.x - 4}px, ${targetRef.current.y - 4}px)`;
        }
        raf = requestAnimationFrame(animate);
      };
      raf = requestAnimationFrame(animate);
  
      return () => {
        window.removeEventListener("mousemove", move);
        cancelAnimationFrame(raf);
      };
    }, []);
  
    return (
      <>
        <div
          ref={cursorRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.3)",
            pointerEvents: "none",
            zIndex: 10000,
            transition: "width 0.3s, height 0.3s, border-color 0.3s",
            mixBlendMode: "difference",
          }}
        />
        <div
          ref={dotRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "white",
            pointerEvents: "none",
            zIndex: 10001,
            mixBlendMode: "difference",
          }}
        />
      </>
    );
  }
  