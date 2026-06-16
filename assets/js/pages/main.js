(function ($) {
  gsap.registerPlugin(ScrollTrigger);

  var heightWin = Motras.heightWin;
  var $kv = $(".kv");
  var $moduleList = $(".module-list");
  var $moduleItem2 = $(".module-item").eq(1);
  var $imgItem2 = $moduleItem2.find(".img");
  var $moduleTitle2 = $moduleItem2.find(".module-title");
  var $detailItems = $(".detail-item");
  var positionEndKv = 0;
  var storySwiper = null;
  var currentMode = Motras.isDesktop() ? "desktop" : "mobile";
  var resizeTimer = null;

  function refreshLayoutMetrics() {
    Motras.updateHeightWin();
    heightWin = Motras.heightWin;
    positionEndKv = $(".module-item").offset().top + $(".module-item").innerHeight();
  }

  refreshLayoutMetrics();

  function kvScrollTrigger(overrides) {
    return $.extend(
      {
        trigger: ".kv",
        start: "top top",
        scrub: 1,
      },
      overrides
    );
  }

  function initKv() {
    gsap
      .timeline({
        scrollTrigger: kvScrollTrigger({
          end: positionEndKv - heightWin,
          onEnterBack: function () {
            $(".kv-bg").css("display", "block");
            $imgItem2.css("display", "none");
          },
          onLeave: function () {
            $(".kv-bg").css("display", "none");
            $imgItem2.css("display", "block");
          },
        }),
      })
      .fromTo(
        ".kv-bg",
        { width: "100%", height: "100%", bottom: "0%", borderRadius: "0px" },
        {
          width: "480px",
          height: "585px",
          bottom: -positionEndKv + $kv.innerHeight(),
          borderRadius: "20px",
          duration: 0.6,
        }
      );

    gsap
      .timeline({
        scrollTrigger: kvScrollTrigger({
          end: $kv.offset().top - heightWin + $kv.innerHeight(),
        }),
      })
      .fromTo(".kv-bg .img", { opacity: 0 }, { opacity: 1 });

    gsap
      .timeline({ scrollTrigger: kvScrollTrigger({ end: "bottom bottom" }) })
      .fromTo(".kv-info", { y: 0 }, { y: -200 });
  }

  function initProductSection() {
    var isDesktop = Motras.isDesktop();

    gsap.fromTo(
      ".product-title-area",
      { y: 200 },
      {
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".product-title-area",
          start: "top 100%",
          toggleActions: "play none none reverse",
        },
      }
    );

    if (isDesktop) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".module-list",
            start: positionEndKv - heightWin,
            end: "bottom 20%",
            scrub: 1,
            onEnter: setImgFixed,
            onEnterBack: setImgFixed,
            onLeaveBack: setImgStatic,
            onUpdate: updateModuleTitleOpacity,
          },
        })
        .fromTo(
          $imgItem2,
          { width: "480px", height: "585px", borderRadius: "20px" },
          { width: "100vw", height: "100vh", borderRadius: "0px", bottom: 0 }
        );

      gsap.timeline({
        scrollTrigger: {
          trigger: ".product",
          start: positionEndKv + $moduleList.innerHeight() + heightWin,
          end: "bottom bottom",
          scrub: 1,
          onEnterBack: function () {
            $imgItem2.css("display", "block");
          },
          onLeave: function () {
            $imgItem2.css("display", "none");
          },
        },
      });
    } else {
      gsap.set($imgItem2, { clearProps: "all" });
      $imgItem2.css("display", "none");
      gsap.set($detailItems.not(":first"), { height: 0 });
    }

    var detailTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".product-detail",
        start: "top top",
        scrub: 0.5,
        pin: true,
        end: "+=" + 4 * heightWin,
        onUpdate: function (self) {
          $detailItems.eq(0).toggleClass("is-show", self.progress > 0);
        },
      },
    });

    [1, 2, 3].forEach(function (index) {
      detailTimeline.fromTo(
        $detailItems.eq(index),
        { height: 0 },
        { height: "100vh", duration: 2 }
      );
    });
  }

  function setImgFixed() {
    $imgItem2.css("position", "fixed");
  }

  function setImgStatic() {
    $imgItem2.css("position", "static");
  }

  function updateModuleTitleOpacity(self) {
    if (self.progress >= 1) {
      $moduleTitle2.css("opacity", 0);
    } else if (self.progress >= 0.7) {
      $moduleTitle2.css("opacity", (self.progress - 0.7) / 0.3);
    } else {
      $moduleTitle2.css("opacity", 1);
    }
  }

  function initEsg() {
    gsap.to(".esg .title-list", {
      x: 0,
      duration: 0.5,
      scrollTrigger: {
        trigger: ".esg",
        start: "top 100%",
        toggleActions: "play none none reverse",
      },
    });

    gsap.to(".esg .desc-list", {
      x: 0,
      duration: 0.5,
      scrollTrigger: {
        trigger: ".esg",
        start: "top 75%",
        end: "top 25%",
        toggleActions: "play none none reverse",
      },
    });

    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".esg",
          start: "top center",
          end: "+=300",
          scrub: 1,
        },
      })
      .fromTo(
        $(".bg-item").eq(0),
        { width: "95%", borderRadius: "30px" },
        { width: "100%", borderRadius: 0, duration: 1 },
        0
      );

    var isDesktop = Motras.isDesktop();
    var esgPinUnits = isDesktop ? 6 : 2.3;
    var esgPinScroll = heightWin * 0.5 * esgPinUnits;
    var esgPinTrigger = {
      trigger: ".esg",
      start: "top top",
      scrub: 1,
      pin: true,
      end: "+=" + esgPinScroll,
    };

    esgPinTrigger.onUpdate = updateEsgState;

    var esgPinTimeline = gsap.timeline({ scrollTrigger: esgPinTrigger });

    esgPinTimeline.to({}, { duration: 1 });

    if (isDesktop) {
      esgPinTimeline
        .add("afterDesc")
        .fromTo($(".img-item").eq(1), { left: "100%" }, { left: 0, duration: 1 }, "afterDesc")
        .fromTo($(".bg-item").eq(1), { height: 0 }, { height: "50vh", duration: 1 }, "afterDesc");
    } else {
      esgPinTimeline
        .to({}, { duration: 0.3 })
        .add("afterDelay")
        .fromTo($(".img-item").eq(1), { left: "100%" }, { left: 0, duration: 1 }, "afterDelay")
        .fromTo($(".bg-item").eq(1), { height: 0 }, { height: "50vh", duration: 1 }, "afterDelay");
    }

    if (isDesktop) {
      esgPinTimeline
        .add("step2")
        .fromTo($(".bg-item").eq(1), { height: "50vh" }, { height: "100vh", duration: 1 }, "step2")
        .fromTo($(".esg-inner"), { marginTop: 0 }, { marginTop: "-50vh", duration: 1 }, "step2")
        .fromTo($(".esg-inner"), { marginTop: "-50vh" }, { marginTop: "-100vh", duration: 1 })
        .fromTo($(".bg-item").eq(2), { height: 0 }, { height: "100vh", duration: 2 }, ">");
    }
  }

  function updateEsgState(self) {
    var switchAt = Motras.isDesktop() ? 0 : 0.12;
    var isForward = self.progress > switchAt;
    var x = isForward ? "-100%" : "0";

    gsap.to(".esg .title-list, .esg .desc-list", { x: x, duration: 0.7, ease: "inOut" });

    $(".esg .title-item").eq(0).toggleClass("is-active", !isForward);
    $(".esg .title-item").eq(1).toggleClass("is-active", isForward);
    $(".esg .desc-item").eq(0).toggleClass("is-active", !isForward);
    $(".esg .desc-item").eq(1).toggleClass("is-active", isForward);
  }

  function syncFutureBgState() {
    var st = ScrollTrigger.getById("future-scroll");
    var $futureBg = $(".future-bg");

    if (!st || !Motras.isDesktop()) {
      return;
    }

    if (st.progress <= 0) {
      $futureBg.css({ position: "fixed", opacity: 0 });
      return;
    }

    $futureBg.css({
      position: st.progress >= 1 ? "absolute" : "fixed",
      opacity: 1,
    });
  }

  function initFuture() {
    var $futureBg = $(".future-bg");
    var $titles = $(".future .future-title, .future .sub-title");

    gsap.set($titles, { opacity: 0 });

    gsap
      .timeline({
        scrollTrigger: {
          id: "future-scroll",
          trigger: ".future-title-area",
          start: "top bottom",
          end: "top top",
          scrub: 1,
          invalidateOnRefresh: true,
          onEnter: function () {
            $futureBg.css({ position: "fixed", opacity: 1 });
          },
          onLeave: function () {
            $futureBg.css({ position: "absolute", opacity: 1 });
          },
          onEnterBack: function () {
            $futureBg.css({ position: "fixed", opacity: 1 });
          },
          onLeaveBack: function () {
            $futureBg.css({ position: "fixed", opacity: 0 });
          },
          onUpdate: function (self) {
            var opacity = Math.min(Math.max((self.progress - 1 / 3) * 3, 0), 1);
            $titles.css("opacity", opacity);
          },
        },
      })
      .fromTo(
        ".future-bg .img",
        { height: "100vh", width: "100%", marginTop: 0, borderRadius: 0 },
        { height: "480px", width: "77%", marginTop: "100px", borderRadius: "50px", duration: 2 }
      );

    syncFutureBgState();
  }

  function resetFutureStatic() {
    var $futureBg = $(".future-bg");
    var $futureImg = $(".future-bg .img");
    var $titles = $(".future .future-title, .future .sub-title");

    gsap.set($futureImg[0], { clearProps: "all" });
    gsap.set($titles, { clearProps: "opacity" });
    $futureImg.css({ width: "", height: "", marginTop: "", borderRadius: "" });

    if (Motras.isDesktop()) {
      $futureBg.removeAttr("style");
      $titles.css("opacity", 0);
    } else {
      $futureBg.css({
        position: "relative",
        top: "",
        left: "",
        opacity: 1,
        transform: "",
      });
      $titles.css("opacity", 1);
    }
  }

  function initStory() {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".story",
          start: "top 70%",
          end: "bottom bottom",
        },
      })
      .fromTo(".story-title-area", { y: "150%" }, { y: 0, duration: 1 }, 0)
      .fromTo(".story-content", { x: "100%" }, { x: 0, duration: 1 }, 0);

  }

  function initStorySwiper() {
    var isDesktop = Motras.isDesktop();

    return new Swiper(".story-swiper", {
      slidesPerView: isDesktop ? 3 : "auto",
      slidesPerGroup: isDesktop ? 1 : 1,
      spaceBetween: isDesktop ? 30 : 20,
      speed: isDesktop ? 700 : 300,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      scrollbar: {
        el: ".swiper-scrollbar",
        draggable: true,
      },
    });
  }

  function initKvInfoMobile() {
    gsap.set(".kv-info", { y: 0 });

    gsap.fromTo(
      ".kv-info",
      { y: 0 },
      {
        y: -200,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".kv-info",
          start: "top center",
          toggleActions: "play none none reverse",
        },
      }
    );
  }

  function resetKvStatic() {
    gsap.set([".kv-bg", ".kv-bg .img", ".kv-info"], { clearProps: "all" });
    $(".kv-bg").css("display", "block");
    $imgItem2.css("display", "none");
  }

  function resetProductStatic() {
    gsap.set($detailItems, { clearProps: "height,opacity,visibility" });
    gsap.set($imgItem2, { clearProps: "all" });
    gsap.set($moduleTitle2, { clearProps: "opacity" });
    $detailItems.removeClass("is-show");
    $detailItems.not(":first").css("height", "0");
    $detailItems.eq(0).css("height", "");
    $imgItem2.css({ display: "none", position: "" });
    $moduleTitle2.css("opacity", "");
  }

  function resetEsgStatic() {
    gsap.set(
      [".esg .title-list", ".esg .desc-list", ".esg-inner", ".bg-item", ".img-item"],
      { clearProps: "all" }
    );
    $(".esg .title-item").removeClass("is-active").eq(0).addClass("is-active");
    $(".esg .desc-item").removeClass("is-active").eq(0).addClass("is-active");
  }

  function resetStoryStatic() {
    gsap.set([".story-title-area", ".story-content"], { clearProps: "all" });
  }

  function destroyPageAnimations() {
    ScrollTrigger.getAll().forEach(function (st) {
      st.kill(true);
    });

    gsap.killTweensOf([
      ".esg .title-list",
      ".esg .desc-list",
      ".kv-bg",
      ".kv-bg .img",
      ".kv-info",
      ".future-bg",
      ".future-bg .img",
      ".future .future-title",
      ".future .sub-title",
      ".story-title-area",
      ".story-content",
      ".product-title-area",
      ".detail-item",
      $imgItem2[0],
      $moduleTitle2[0],
    ]);

    if (storySwiper) {
      storySwiper.destroy(true, true);
      storySwiper = null;
    }
  }

  function resetPageStatic() {
    resetKvStatic();
    resetProductStatic();
    resetEsgStatic();
    resetFutureStatic();
    resetStoryStatic();
  }

  function initPageAnimations() {
    refreshLayoutMetrics();
    resetPageStatic();

    if (Motras.isDesktop()) {
      initKv();
    } else {
      initKvInfoMobile();
    }

    initProductSection();
    initEsg();

    if (Motras.isDesktop()) {
      initFuture();
    }

    initStory();
    storySwiper = initStorySwiper();

    requestAnimationFrame(function () {
      refreshLayoutMetrics();
      ScrollTrigger.refresh();
      syncFutureBgState();
      if (storySwiper) {
        storySwiper.update();
      }
    });
  }

  function handleBreakpointChange() {
    var nextMode = Motras.isDesktop() ? "desktop" : "mobile";

    if (nextMode === currentMode) {
      return;
    }

    currentMode = nextMode;
    destroyPageAnimations();
    initPageAnimations();
  }

  function handleViewportResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      refreshLayoutMetrics();

      if ((Motras.isDesktop() ? "desktop" : "mobile") !== currentMode) {
        return;
      }

      ScrollTrigger.refresh();
      syncFutureBgState();

      if (storySwiper) {
        storySwiper.update();
      }
    }, 200);
  }

  Motras.splitText(".split-text");

  Motras.initLayout({
    highlight: ".text-group .highlight",
    mobileMenu: true,
    footer: true,
  });

  initPageAnimations();

  window.matchMedia("(min-width: 1025px)").addEventListener("change", handleBreakpointChange);
  $(window).on("resize.main", handleViewportResize);
})(jQuery);
