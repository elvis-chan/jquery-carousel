(function ($, window, document) {
  'use strict';

  const defaults = {
    animateDuration: 700,
    loop: true,
    loopInterval: 5000,
  };

  function EcCarousel(element, options) {
    this.options = $.extend(true, {}, defaults, options);
    this.element = $(element);

    this.$slides = $();
    this.$dots = $();

    this.init();
  }

  $.extend(EcCarousel.prototype, {

    attachListeners: function () {
      $('li', this.$dots).on('click', this.handleClickDot.bind(this));

      if (this.element.swipe) {
        this.element.swipe({ swipe: this.handleSwipeCarousel.bind(this) });
      }
    },

    autoLoop: function () {
      if (!this.options.loop) {
        return false;
      }

      clearInterval(this.autoLoopWorker);

      this.autoLoopWorker = setInterval(this.gotoNextSlide.bind(this), this.options.loopInterval);

      return true;
    },

    buildDots: function () {
      this.$dots = $('<ul/>', { class: 'ec-dots' });

      for (let i = 0; i < this.slidesLength; i += 1) {
        this.$dots.append(`<li><button>${i}</button></li>`);
      }

      this.$dots.children().first().addClass('ec-selected');
      this.element.append(this.$dots);
    },

    buildSlides: function () {
      const slidesClass = 'ec-slides';
      const slideClass = 'ec-slide';
      const slideContentClass = 'ec-slide-content';

      const $slides = $('<div/>', { class: slidesClass });
      
      this.element.wrapInner($slides);

      this.$slides = this.element.find(`.${slidesClass}`);

      this.$slides.children().each((idx, el) => {
        $(el).addClass(slideClass)
          .wrapInner($('<div/>', { class: slideContentClass }))
          .css({ left: `calc(100vw * ${idx})` });
      });
    },

    gotoPrevSlide: function () {
      const $selectedDot = $('.ec-selected', this.$dots);

      let $candidateDot = $selectedDot.prev();

      if ($candidateDot.length === 0) {
        $candidateDot = this.$dots.children().last();
      }

      $candidateDot.click();
    },

    gotoNextSlide: function () {
      const $selectedDot = $('.ec-selected', this.$dots);

      let $candidateDot = $selectedDot.next();

      if ($candidateDot.length === 0) {
        $candidateDot = this.$dots.children().first();
      }

      $candidateDot.click();
    },

    handleClickDot: function (e) {
      this.$slides.removeClass('ec-stop-transition')
        .css({
          transition: `all ${this.options.animateDuration}ms ease-in-out`,
          transform: `translateX(${-100 * $(e.currentTarget).index()}vw)`,
        });

      setTimeout(() => {
        this.$slides.addClass('ec-stop-transition');
        this.autoLoop();
      }, this.options.animateDuration);

      $('li', this.$dots).removeClass('ec-selected');
      $(e.currentTarget).addClass('ec-selected');
    },

    handleSwipeCarousel: function (e, direction) {
      if (direction === 'left') {
        this.gotoNextSlide();
      } else if (direction === 'right') {
        this.gotoPrevSlide();
      }
    },

    init: function () {
      if (!this.element.hasClass('ec-ready')) {
        this.element.addClass('ec-carousel');

        this.slidesLength = this.element.children().length;

        this.buildSlides();
        this.buildDots();
        this.attachListeners();
        this.autoLoop();

        this.element.addClass('ec-ready');
      }
    },
  });

  $.fn.ecCarousel = function (options) {
    return this.each(function () {
      if (!$.data(this, 'ecCarousel')) {
        $.data(this, 'ecCarousel', new EcCarousel(this, options));
      }
    });
  };

})(jQuery, window, document);
