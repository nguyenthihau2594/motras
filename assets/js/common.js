(function ($) {
  var heightWin = $(window).innerHeight();
  var header = $(".header");
  var navItem = $(".gnb .gnb-item");

  function animateText(selector) {
    var scrollTop = $(window).scrollTop();
    var threshold = (heightWin * 2) / 3;

    $(selector).each(function () {
      var $el = $(this);
      var isActive = scrollTop > $el.offset().top - threshold;
      $el.toggleClass("is-active", isActive);
    });
  }

  function handleHoverNav() {
    navItem.on("mouseenter", function () {
      header.addClass("is-open");
      $(".header-sgnb").stop().slideDown(250);
    });

    header.on("mouseleave", function () {
      header.removeClass("is-open");
      $(".header-sgnb").stop().slideUp(250);
    });
  }

  function activeNavItem() {
    $("[data-nav]").on("mouseenter", function () {
      var dataNav = $(this).attr("data-nav");
      $(".sgnb-list, .gnb-item").removeClass("is-active");
      $('.sgnb-list[data-nav="' + dataNav + '"], .gnb-item[data-nav="' + dataNav + '"]').addClass(
        "is-active"
      );
    });
  }

  function createHeaderScrollHandler() {
    var lastScroll = $(window).scrollTop();

    return function () {
      var scroll = $(window).scrollTop();

      if (scroll > lastScroll) {
        header.addClass("is-hidden").removeClass("is-white");
      } else {
        header.removeClass("is-hidden").addClass("is-white");
      }

      if (scroll === 0) {
        header.removeClass("is-white");
      }

      lastScroll = scroll;
    };
  }

  function handleMobileMenu() {
    var $side = $(".header-side");
    var $dimmed = $(".dimmed");
    var $btnMenu = $(".btn-menu");

    function openMenu() {
      $side.addClass("is-open");
      $dimmed.addClass("is-open");
      $btnMenu.addClass("is-open");
      $("body").addClass("is-menu-open");
    }

    function closeMenu() {
      $side.removeClass("is-open");
      $dimmed.removeClass("is-open");
      $btnMenu.removeClass("is-open");
      $("body").removeClass("is-menu-open");
    }

    $btnMenu.on("click", openMenu);
    $(".btn-close, .dimmed").on("click", closeMenu);
  }

  function expandSidegnbList($list) {
    $list.css("height", $list[0].scrollHeight + "px");
    $list.one("transitionend", function (e) {
      if (e.originalEvent.propertyName === "height") {
        $list.css("height", "auto");
      }
    });
  }

  function collapseSidegnbList($list) {
    $list.css("height", $list[0].scrollHeight + "px");
    $list[0].offsetHeight;
    $list.css("height", "0");
  }

  function handleToggleGnbMo() {
    $(".sidegnb-list").css("height", "0");

    $(".sidegnb-title").on("click", function (e) {
      e.preventDefault();
      var $group = $(this).closest(".sidegnb-group");
      var $list = $group.find(".sidegnb-list");
      var isOpen = $group.hasClass("is-open");

      $(".sidegnb-group.is-open").each(function () {
        var $openGroup = $(this);
        if (!$openGroup.is($group)) {
          collapseSidegnbList($openGroup.find(".sidegnb-list"));
          $openGroup.removeClass("is-open");
        }
      });

      if (isOpen) {
        collapseSidegnbList($list);
        $group.removeClass("is-open");
      } else {
        $group.addClass("is-open");
        expandSidegnbList($list);
      }
    });
  }

  function handleClickFooterTab() {
    var $footerSite = $(".footer-site");
    var $selectBtn = $(".footer-site-select");
    var $selectLabel = $(".footer-site-select-label");

    function closeSiteSelect() {
      $footerSite.removeClass("is-open");
      $selectBtn.attr("aria-expanded", "false");
    }

    function syncSiteSelectLabel() {
      if (!$selectLabel.length) {
        return;
      }
      $selectLabel.text($(".footer .tab-btn.is-active").first().text());
    }

    syncSiteSelectLabel();

    $selectBtn.on("click", function (e) {
      e.stopPropagation();
      var isOpen = $footerSite.toggleClass("is-open").hasClass("is-open");
      $selectBtn.attr("aria-expanded", isOpen);
    });

    $footerSite.on("click", function (e) {
      e.stopPropagation();
    });

    $(document).on("click.footerSiteSelect", closeSiteSelect);

    $(".footer .tab-btn").on("click", function () {
      var id = $(this).attr("id");
      $(".footer .tab-btn").removeClass("is-active");
      $(this).addClass("is-active");
      $(".footer .tab-panel").removeClass("is-active").attr("aria-hidden", true);
      $('.footer .tab-panel[aria-labelledby="' + id + '"]')
        .addClass("is-active")
        .attr("aria-hidden", false);
      syncSiteSelectLabel();
      closeSiteSelect();
    });
  }

  function handleToggleFooterFamily() {
    $(".footer-family-btn").on("click", function () {
      var $footerFamily = $(".footer-family");
      var isOpen = !$footerFamily.hasClass("is-open");

      $footerFamily.toggleClass("is-open");
      gsap.to(".footer-family .footer-family-info", {
        height: isOpen ? "50vh" : 0,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }

  function expandBannerBg() {
    gsap.to(".banner-bg", { width: "100%", top: 0, duration: 0.5 });
  }

  window.Motras = {
    heightWin: heightWin,

    isDesktop: function () {
      return window.matchMedia("(min-width: 1025px)").matches;
    },

    updateHeightWin: function () {
      heightWin = $(window).innerHeight();
      this.heightWin = heightWin;
      return heightWin;
    },

    bannerIntro: function (selector, duration) {
      gsap.fromTo(
        selector,
        { y: "50px", opacity: 0 },
        { y: 0, opacity: 1, duration: duration || 0.7 }
      );
    },

    bannerParallax: function (options) {
      var opts = $.extend(
        {
          start: "top 0",
          end: "+=670",
          pin: false,
        },
        options
      );

      gsap.timeline({
        scrollTrigger: {
          trigger: ".banner",
          start: opts.start,
          end: opts.end,
          scrub: 1,
          pin: opts.pin,
          onUpdate: function (self) {
            if (self.progress > 0.1) {
              expandBannerBg();
            }
          },
        },
      });
    },

    splitText: function (selector) {
      $(selector).each(function () {
        var html = $(this)
          .text()
          .split("")
          .map(function (char, index) {
            return (
              '<span style="transition-delay:' + index * 0.05 + 's">' + char + "</span>"
            );
          })
          .join("");
        $(this).html(html);
      });
    },

    initLayout: function (options) {
      var opts = $.extend(
        {
          highlight: ".text-animate .highlight",
          mobileMenu: false,
          footer: false,
          onScroll: null,
        },
        options
      );

      var updateHeader = createHeaderScrollHandler();

      handleHoverNav();
      activeNavItem();

      if (opts.mobileMenu) {
        handleMobileMenu();
        handleToggleGnbMo();
      }

      if (opts.footer) {
        handleClickFooterTab();
        handleToggleFooterFamily();
      }

      function onScroll() {
        updateHeader();
        animateText(opts.highlight);
        if (opts.onScroll) {
          opts.onScroll();
        }
      }

      onScroll();
      $(window).on("scroll", onScroll);
    },
  };
})(jQuery);
