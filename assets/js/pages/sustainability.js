Motras.bannerIntro(".banner-inner", 1);
Motras.bannerParallax({ pin: true });

gsap.timeline({
  scrollTrigger: {
    trigger: ".sustainabilyty-text",
    start: "top 75%",
    scrub: 1,
    onEnter: function () {
      gsap.to(".sustainabilyty-text", { x: 0, opacity: 0.04, duration: 1 });
    },
    onLeaveBack: function () {
      gsap.to(".sustainabilyty-text", { x: "11%", opacity: 0, duration: 1 });
    },
  },
});

gsap.timeline({
  scrollTrigger: {
    trigger: ".goals",
    start: "top 0",
    scrub: 1,
    end: "+=3225",
    pin: true,
  },
}).fromTo(".goals-list", { x: "23%" }, { x: "-50%", duration: 1 });

Motras.initLayout();
