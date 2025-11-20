import { useEffect } from "react";

export default function useInfiniteScroll(callback) {
  useEffect(() => {
    let timer;
    function handleScroll() {
      if (timer) clearTimeout(timer);

      timer = setTimeout(() => {
        const bottom =
          window.innerHeight + window.scrollY >= document.body.offsetHeight - 500;
        if (bottom) callback();
      }, 500); // throttle 150ms
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [callback]);
}
