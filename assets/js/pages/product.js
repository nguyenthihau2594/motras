var heightWin = Motras.heightWin;
var moduleItemStyle = { top: "100%", borderRadius: "170px 170px 0px 0px" };
var moduleItemEnd = { top: 0, borderRadius: "0px", duration: 1 };

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

Motras.bannerIntro(".banner-content");
Motras.bannerParallax({ start: "top top", end: "bottom top" });

var moduleTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: ".product-module",
    start: "top top",
    scrub: 1,
    end: "+=400%",
    pin: true,
  },
});

moduleTimeline
  .add("first")
  .fromTo(".banner-inner", { scale: 1, opacity: 1 }, { scale: 0.9, opacity: 0, duration: 1 }, "first")
  .fromTo($(".module-item").eq(0), moduleItemStyle, moduleItemEnd, "first")
  .fromTo(".module-tab", { top: "100%" }, { top: "85%", duration: 0.15, delay: 0.85 }, "first")
  .fromTo(".module-info", { top: "100%" }, { top: 0, duration: 1 }, "first");

["second", "third", "fourth"].forEach(function (label, index) {
  var moduleIndex = index + 1;

  moduleTimeline
    .add(label)
    .fromTo(
      $(".module-bg").eq(index),
      { scale: 1, opacity: 1 },
      { scale: 0.9, opacity: 0, duration: 1 },
      label
    )
    .fromTo($(".module-item").eq(moduleIndex), moduleItemStyle, moduleItemEnd, label);
});

function showTitleModule() {
  $(".module-item").each(function (i, el) {
    var y = el.getBoundingClientRect().y;
    if (y > -300 && y < 200) {
      $(".info-item, .tab-item").removeClass("is-show is-active");
      $(".info-item").eq(i).addClass("is-show");
      $(".tab-item").eq(i).addClass("is-active");
    }
  });
}

$(".product-module .tab-btn").each(function (i) {
  $(this).on("click", function () {
    gsap.to(window, {
      scrollTo: {
        y: heightWin + (($(".footer").offset().top - 2 * heightWin) / 4) * (i + 1),
        autoKill: true,
      },
      duration: 1,
    });
  });
});

Motras.initLayout({ onScroll: showTitleModule });
