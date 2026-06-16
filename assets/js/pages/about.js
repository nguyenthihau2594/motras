Motras.bannerIntro(".banner-inner");
Motras.bannerParallax({ pin: true });

gsap
  .timeline({
    scrollTrigger: {
      trigger: ".introduce",
      start: "top top",
      scrub: 1,
      pin: true,
      end: "+=500%",
    },
  })
  .add("first")
  .fromTo(
    $(".introduce-img"),
    { bottom: "20%", transform: "none", left: 0, width: "463px" },
    {
      bottom: "50%",
      left: "50%",
      width: "1233px",
      transform: "translate(-50%, 50%)",
      duration: 1,
      delay: 1,
    },
    "first"
  )
  .to($(".introduce-text"), { y: -300, opacity: 0, duration: 1, delay: 1 }, "first")
  .to($(".introduce-circle"), { x: 400, opacity: 0, duration: 1, delay: 1 }, "first")
  .fromTo(".introduce-car .img", { opacity: 0 }, { opacity: 1, duration: 1 })
  .add("second")
  .fromTo(".introduce-car .img", { opacity: 0 }, { opacity: 1, duration: 1 })
  .fromTo($(".introduce-img"), { opacity: 1 }, { y: -300, opacity: 0, duration: 1 }, "second")
  .fromTo(
    ".introduce-car .img",
    { opacity: 1 },
    { y: -300, opacity: 0, duration: 1 },
    "second"
  )
  .fromTo(
    ".history-bg",
    { top: "100%", opacity: 0 },
    { top: "50%", opacity: 1, duration: 1 }
  )
  .to(".history-bg", { width: "800px", height: "800px", duration: 1 }, "third")
  .fromTo(
    ".history-desc",
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1 }
  )
  .fromTo(
    ".history-desc",
    { y: 0, opacity: 1 },
    { y: -200, opacity: 0, duration: 1, delay: 1 }
  )
  .add("fourth")
  .to(".history-bg", { width: "2150px", height: "2150px", duration: 1 }, "fourth")
  .fromTo(
    ".history-bg .img",
    { width: 0, height: 0 },
    { width: "2150px", height: "2150px", duration: 1 },
    "fourth"
  )
  .add("fifth")
  .fromTo(
    ".history-logo",
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1 },
    "fifth"
  )
  .fromTo(
    ".history-list",
    { y: 100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1 },
    "fifth"
  );

Motras.initLayout();
