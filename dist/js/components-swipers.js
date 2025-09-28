// JavaScript extracted from components\swipers.html

// Inline script 4 from swipers.html
document.querySelectorAll('[swiper="sw01"]').forEach((sliderComponent) => {
  const sliderEl = sliderComponent.querySelector('[swiper="slider"]');
  const buttonNextEl = sliderComponent.querySelector('[swiper="next-button"]');
  const buttonPrevEl = sliderComponent.querySelector('[swiper="prev-button"]');
  const paginationEl = sliderComponent.querySelector('[swiper="pagination"]');
  new Swiper(sliderEl, {
    slidesPerView: 1,
    spaceBetween: 0,
    direction: 'horizontal',
    pagination: {
      el: paginationEl,
    },
    navigation: {
      nextEl: buttonNextEl,
      prevEl: buttonPrevEl,
    },
    breakpoints: {
      // when window width is >= 768px
      768: {
        spaceBetween: 0,
      },
    },
  });
});

// Inline script 5 from swipers.html
/* START: Swiper 9 - Gallery Swiper */
document.querySelectorAll('[swiper="sw02"]').forEach((sliderComponent) => {
  const sliderMainEl = sliderComponent.querySelector('[swiper="slider-main"]');
  const sliderThumbsEl = sliderComponent.querySelector('[swiper="slider-thumbs"]');
  const thumbsSlider = new Swiper(sliderThumbsEl, {
    spaceBetween: 8,
    slidesPerView: 5,
    watchSlidesProgress: true,
    breakpoints: {
      // when window width is >= 400px
      0: {
        spaceBetween: 8,
      },
      // when window width is >= 400px
      400: {
        spaceBetween: 8,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 4,
      },
    },
  });
  const mainSlider = new Swiper(sliderMainEl, {
    spaceBetween: 16,
    speed: 800,
    effect: 'fade',
    thumbs: {
      swiper: thumbsSlider,
      autoScrollOffset: 1,
    },
    breakpoints: {
      // when window width is >= 768px
      768: {
        spaceBetween: 32,
      },
    },
  });
  sliderThumbsEl.querySelectorAll('.swiper-slide').forEach((slide, index) => {
    slide.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        thumbsSlider.slideTo(index, 0);
        mainSlider.slideTo(index);
      }
    });
  });
});

// Inline script 6 from swipers.html
/* START: Swiper features - Swiper Simple Starter 2 */
document.querySelectorAll('[swiper="sw03"]').forEach((sliderComponent) => {
  const sliderEl = sliderComponent.querySelector('[swiper="slider"]');
  const buttonNextEl = sliderComponent.querySelector('[swiper="next-button"]');
  const buttonPrevEl = sliderComponent.querySelector('[swiper="prev-button"]');
  const paginationEl = sliderComponent.querySelector('[swiper="pagination"]');
  new Swiper(sliderEl, {
    slidesPerView: 3,
    spaceBetween: 16,
    direction: 'horizontal',
    rewind: true,
    effect: 'slide',
    pagination: {
      el: paginationEl,
    },
    navigation: {
      nextEl: buttonNextEl,
      prevEl: buttonPrevEl,
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 24,
      },
    },
  });
});
/* END: Swiper features - Swiper Simple Starter 2 */

// Inline script 8 from swipers.html
/* START: Swiper features - Swiper Simple Starter 2 */
document.querySelectorAll('[swiper="sw04"]').forEach((sliderComponent) => {
  const sliderEl = sliderComponent.querySelector('[swiper="slider"]');
  const buttonNextEl = sliderComponent.querySelector('[swiper="next-button"]');
  const buttonPrevEl = sliderComponent.querySelector('[swiper="prev-button"]');
  new Swiper(sliderEl, {
    slidesPerView: 4,
    spaceBetween: 16,
    direction: 'horizontal',
    rewind: true,
    effect: 'slide',
    navigation: {
      nextEl: buttonNextEl,
      prevEl: buttonPrevEl,
    },
    breakpoints: {
      768: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 24,
      },
    },
  });
});
/* END: Swiper features - Swiper Simple Starter 2 */

// Inline script 9 from swipers.html
/* START: Swiper features - Swiper Simple Starter 2 */
document.querySelectorAll('[swiper="sw05"]').forEach((sliderComponent) => {
  const sliderEl = sliderComponent.querySelector('[swiper="slider"]');
  const buttonNextEl = sliderComponent.querySelector('[swiper="next-button"]');
  const buttonPrevEl = sliderComponent.querySelector('[swiper="prev-button"]');
  const paginationEl = sliderComponent.querySelector('[swiper="pagination"]');
  new Swiper(sliderEl, {
    slidesPerView: 3,
    spaceBetween: 16,
    direction: 'horizontal',
    initialSlide: 1,
    rewind: true,
    effect: 'slide',
    pagination: {
      el: paginationEl,
    },
    navigation: {
      nextEl: buttonNextEl,
      prevEl: buttonPrevEl,
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 16,
      },
      0: {
        slidesPerView: 1.1,
        centeredSlides: true,
        spaceBetween: 12,
      },
    },
  });
});

// Inline script 11 from swipers.html
/* START: Swiper ugc - Swiper Simple Starter 2 */
document.querySelectorAll('[swiper="sw06"]').forEach((sliderComponent) => {
  const sliderEl = sliderComponent.querySelector('[swiper="slider"]');
  const buttonNextEl = sliderComponent.querySelector('[swiper="next-button"]');
  const buttonPrevEl = sliderComponent.querySelector('[swiper="prev-button"]');
  const paginationEl = sliderComponent.querySelector('[swiper="pagination"]');
  new Swiper(sliderEl, {
    slidesPerView: 4,
    spaceBetween: 16,
    loop: false,
    direction: 'horizontal',
    rewind: true,
    pagination: {
      el: paginationEl,
    },
    navigation: {
      nextEl: buttonNextEl,
      prevEl: buttonPrevEl,
    },
    breakpoints: {
      // when window width is >= 768px
      768: {
        slidesPerView: 4,
        spaceBetween: 16,
      },
      0: {
        slidesPerView: 1.6,
        centeredSlides: true,
        loop: true,
        spaceBetween: 16,
      },
    },
  });
});
/* END: Swiper ugc - Swiper Simple Starter 2 */

// Inline script 12 from swipers.html
/* START: Swiper features - Swiper Simple Starter 2 */
document.querySelectorAll('[swiper="sw07"]').forEach((sliderComponent) => {
  const sliderEl = sliderComponent.querySelector('[swiper="slider"]');
  const buttonNextEl = sliderComponent.querySelector('[swiper="next-button"]');
  const buttonPrevEl = sliderComponent.querySelector('[swiper="prev-button"]');
  const paginationEl = sliderComponent.querySelector('[swiper="pagination"]');
  new Swiper(sliderEl, {
    slidesPerView: 3,
    spaceBetween: 16,
    direction: 'horizontal',
    centeredSlides: true,
    loop: true,
    rewind: true,
    effect: 'slide',
    pagination: {
      el: paginationEl,
    },
    navigation: {
      nextEl: buttonNextEl,
      prevEl: buttonPrevEl,
    },
    breakpoints: {
      768: {
        slidesPerView: 3,
        spaceBetween: 24,
      },
      0: {
        slidesPerView: 1,
        spaceBetween: 24,
      },
    },
  });
});
/* END: Swiper features - Swiper Simple Starter 2 */

// Inline script 13 from swipers.html
document.querySelectorAll('[swiper="sw08"]').forEach((sliderComponent) => {
  // Get elements
  const sliderEl = sliderComponent.querySelector('[swiper="slider"]');
  const buttonNextEl = sliderComponent.querySelector('[swiper="next-button"]');
  const buttonPrevEl = sliderComponent.querySelector('[swiper="prev-button"]');
  const paginationEl = sliderComponent.querySelector('[swiper="pagination"]');
  const thumbnailsHolder = document.querySelector('[swiper="thumbnails-holder"]');
  // Initialize main swiper
  const mainSwiper = new Swiper(sliderEl, {
    slidesPerView: 1,
    spaceBetween: 16,
    direction: 'horizontal',
    navigation: {
      nextEl: buttonNextEl,
      prevEl: buttonPrevEl,
    },
    pagination: {
      el: paginationEl,
    },
    breakpoints: {
      768: {
        spaceBetween: 32,
      },
    },
    on: {
      slideChange: function() {
        // Update thumbnails when slide changes
        if (thumbnailsHolder) {
          const thumbnails = thumbnailsHolder.querySelectorAll('[swiper="gallery-thumbnail"]');
          thumbnails.forEach((thumbnail, index) => {
            if (index === this.activeIndex) {
              thumbnail.setAttribute('swiper-state', 'active');
              thumbnail.classList.add('is-current');
            } else {
              thumbnail.removeAttribute('swiper-state');
              thumbnail.classList.remove('is-current');
            }
          });
        }
      },
      init: function() {
        // Set initial active state
        if (thumbnailsHolder) {
          const firstThumbnail = thumbnailsHolder.querySelector('[swiper="gallery-thumbnail"]');
          if (firstThumbnail) {
            firstThumbnail.setAttribute('swiper-state', 'active');
            firstThumbnail.classList.add('is-current');
          }
        }
      }
    }
  });
  // Set up thumbnail click handlers
  if (thumbnailsHolder) {
    const thumbnails = thumbnailsHolder.querySelectorAll('[swiper="gallery-thumbnail"]');
    thumbnails.forEach((thumbnail, index) => {
      thumbnail.style.userSelect = 'none';
      thumbnail.setAttribute('tabindex', '0');
      // Add click handler
      thumbnail.addEventListener('click', () => {
        mainSwiper.slideTo(index);
      });
      // Add keyboard support
      thumbnail.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          mainSwiper.slideTo(index);
        }
      });
    });
  }
});

// Inline script 14 from swipers.html
/* START: Swiper 7 - Swiper Tabs 2 */
const sliderComponent7 = document.querySelectorAll('[swiper="sw09"]');
sliderComponent7.forEach((sliderComponent) => {
  const sliderNavEl = sliderComponent.querySelector('[swiper="slider-nav"]');
  const sliderContentEl = sliderComponent.querySelector('[swiper="slider-content"]');
  const tabNav = new Swiper(sliderNavEl, {
    spaceBetween: 12,
    slidesPerView: 'auto',
    watchSlidesProgress: true,
    breakpoints: {
      // when window width is >= 768px
      768: {
        spaceBetween: 12,
      },
    },
  });
  const tabContent = new Swiper(sliderContentEl, {
    allowTouchMove: false,
    autoHeight: true,
    speed: 800,
    effect: 'creative',
    creativeEffect: {
      prev: {
        translate: [0, 0, -1],
        opacity: 0,
      },
      next: {
        translate: [0, 0, -1],
        opacity: 0,
      },
    },
    thumbs: {
      swiper: tabNav,
      autoScrollOffset: 1,
    },
  });
  sliderNavEl.querySelectorAll('.swiper-slide').forEach((slide, index) => {
    slide.addEventListener('click', () => {
      tabNav.slideTo(index);
      tabContent.slideTo(index);
    });
    // Keydown-Event-Listener
    slide.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        tabNav.slideTo(index);
        tabContent.slideTo(index);
      }
    });
  });
});
/* END: Swiper 7 - Swiper Tabs 2 */

// Inline script 15 from swipers.html
/* START: Swiper 9 - Gallery Swiper */
document.querySelectorAll('[swiper="sw10"]').forEach((sliderComponent) => {
  const sliderMainEl = sliderComponent.querySelector('[swiper="slider-main"]');
  const sliderThumbsEl = sliderComponent.querySelector('[swiper="slider-thumbs"]');
  const thumbsSlider = new Swiper(sliderThumbsEl, {
    spaceBetween: 8,
    slidesPerView: 5,
    watchSlidesProgress: true,
    breakpoints: {
      // when window width is >= 400px
      400: {
        spaceBetween: 8,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 5,
      },
    },
  });
  const mainSlider = new Swiper(sliderMainEl, {
    spaceBetween: 8,
    speed: 300,
    slidesPerView: 1.10,
    thumbs: {
      swiper: thumbsSlider,
      autoScrollOffset: 1,
    },
    breakpoints: {
      // when window width is >= 768px
      768: {
        spaceBetween: 16,
      },
    },
  });
  sliderThumbsEl.querySelectorAll('.swiper-slide').forEach((slide, index) => {
    slide.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        thumbsSlider.slideTo(index, 0);
        mainSlider.slideTo(index);
      }
    });
  });

  function debounce(func) {
    var timer;
    return function(event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, 80, event);
    };
  }

  function addMarginToComponent() {
    const thumbsSliderHeight =
      sliderComponent.querySelector('.swiper-thumbs-wrap.is-sw10').offsetHeight;
    sliderComponent.style.marginBottom = thumbsSliderHeight / 2 + 'px';
  }
  // addMarginToComponent();
  // window.addEventListener('resize', debounce(addMarginToComponent));
});
/* END: Swiper 9 - Gallery Swiper */

// Inline script 16 from swipers.html
/* START: Swiper 9 - Gallery Swiper */
document.querySelectorAll('[swiper="sw11"]').forEach((sliderComponent) => {
  const sliderMainEl = sliderComponent.querySelector('[swiper="slider-main"]');
  const sliderThumbsEl = sliderComponent.querySelector('[swiper="slider-thumbs"]');
  const thumbsSlider = new Swiper(sliderThumbsEl, {
    spaceBetween: 8,
    slidesPerView: 6,
    watchSlidesProgress: true,
    breakpoints: {
      // when window width is >= 400px
      400: {
        spaceBetween: 8,
      },
      // when window width is >= 768px
      768: {
        slidesPerView: 6,
      },
    },
  });
  const mainSlider = new Swiper(sliderMainEl, {
    spaceBetween: 8,
    speed: 300,
    slidesPerView: 1.10,
    thumbs: {
      swiper: thumbsSlider,
      autoScrollOffset: 1,
    },
    breakpoints: {
      // when window width is >= 768px
      768: {
        spaceBetween: 8,
      },
    },
  });
  sliderThumbsEl.querySelectorAll('.swiper-slide').forEach((slide, index) => {
    slide.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        thumbsSlider.slideTo(index, 0);
        mainSlider.slideTo(index);
      }
    });
  });

  function debounce(func) {
    var timer;
    return function(event) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(func, 80, event);
    };
  }

  function addMarginToComponent() {
    const thumbsSliderHeight =
      sliderComponent.querySelector('.swiper-thumbs-wrap.is-sw11').offsetHeight;
    sliderComponent.style.marginBottom = thumbsSliderHeight / 2 + 'px';
  }
  // addMarginToComponent();
  // window.addEventListener('resize', debounce(addMarginToComponent));
});
/* END: Swiper 9 - Gallery Swiper */

// Inline script 17 from swipers.html
document.querySelectorAll('[swiper="sw12"]').forEach((sliderComponent) => {
  const sliderMain = sliderComponent.querySelector('[swiper="slider-main"]');
  const sliderThumbs = sliderComponent.querySelector('[swiper="slider-thumbs"]');
  const buttonNextEl = sliderComponent.querySelector('[swiper="next-button"]');
  const buttonPrevEl = sliderComponent.querySelector('[swiper="prev-button"]');
  // Initialize thumbs swiper first
  const thumbsSwiper = new Swiper(sliderThumbs, {
    slidesPerView: 5, // Show a fixed number of thumbs
    spaceBetween: 10,
    freeMode: false, // Disable free mode for proper controlled movement
    watchSlidesProgress: true,
    watchOverflow: true, // Prevent extra spacing when fewer slides exist
    centerInsufficientSlides: true, // Prevents misalignment when fewer thumbs exist
    breakpoints: {
      768: {
        slidesPerView: 5, // Adjust for desktop
        spaceBetween: 10,
      },
      480: {
        slidesPerView: 5, // Adjust for mobile
        spaceBetween: 8,
      },
    },
  });
  // Initialize main swiper with thumbs navigation
  new Swiper(sliderMain, {
    slidesPerView: 1,
    spaceBetween: 0,
    navigation: {
      nextEl: buttonNextEl,
      prevEl: buttonPrevEl,
    },
    thumbs: {
      swiper: thumbsSwiper,
    },
  });
  // Add keyboard accessibility for thumbs
  if (sliderThumbs) {
    sliderThumbs.querySelectorAll('.swiper-slide').forEach((slide, index) => {
      slide.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          thumbsSwiper.slideTo(index, 300);
        }
      });
    });
  }
});

// Inline script 18 from swipers.html
function initiateSlider() {
  document.querySelectorAll('[swiper="sw13"]').forEach((sliderComponent) => {
    let currentSlide = 0;
    const swiperStyle = document.createElement('style');
    swiperStyle.innerHTML = `.swiper-button-disabled {opacity: 30%!important}`;
    document.body.appendChild(swiperStyle);
    const numberOfSlides = document
      .querySelector('[swiper="thumbnails-holder"]')
      .querySelectorAll('[swiper="gallery-thumbnail"]').length - 1;
    const sliderEl = sliderComponent.querySelector('[swiper="slider"]');
    const buttonNextEl = sliderComponent.querySelector('[swiper="next-button"]');
    const buttonPrevEl = sliderComponent.querySelector('[swiper="prev-button"]');
    const scrollbarEl = sliderComponent.querySelector('[swiper="scrollbar"]');
    const paginationEl = sliderComponent.querySelector('[swiper="pagination"]');
    const swiperModule = new Swiper(sliderEl, {
      slidesPerView: 1,
      spaceBetween: 16,
      direction: 'horizontal',
      navigation: {
        nextEl: buttonNextEl,
        prevEl: buttonPrevEl,
      },
      on: {
        slideChange: function() {
          currentSlide = this.activeIndex;
          updateActiveStates(currentSlide);
        },
      },
      pagination: {
        el: paginationEl,
      },
      breakpoints: {
        768: {
          spaceBetween: 32,
        },
      },
    });
    if (currentSlide == 0) {
      buttonPrevEl.classList.add('swiper-button-disabled');
    } else {
      buttonPrevEl.classList.remove('swiper-button-disabled');
    }
    document.querySelectorAll('[swiper="thumbnails-holder"]').forEach((container) =>
      container.querySelectorAll('[swiper="gallery-thumbnail"]').forEach((el, i) => {
        el.style.userSelect = 'none';
        el.addEventListener('click', (e) => {
          swiperModule.slideTo(i);
          currentSlide = i;
          updateActiveStates(currentSlide);
        });
      })
    );
    // Initial state
    updateActiveStates(0);
  });
}

function updateActiveStates(activeIndex) {
  // Update thumbnails
  document.querySelectorAll('[swiper="thumbnails-holder"]').forEach((container) =>
    container.querySelectorAll('[swiper="gallery-thumbnail"]').forEach((el, i) => {
      if (i === activeIndex) {
        el.setAttribute('swiper-state', 'active');
        el.classList.add('is-current');
      } else {
        el.removeAttribute('swiper-state');
        el.classList.remove('is-current');
      }
    })
  );
  // Update slides
  document.querySelectorAll('.swiper-slide').forEach((slide, i) => {
    if (i === activeIndex) {
      slide.classList.add('is-current');
    } else {
      slide.classList.remove('is-current');
    }
  });
}
initiateSlider();

// Inline script 19 from swipers.html
function initiateSlider() {
  document.querySelectorAll('[swiper="sw14"]').forEach((sliderComponent) => {
    let currentSlide = 0;
    const swiperStyle = document.createElement('style');
    swiperStyle.innerHTML = `.swiper-button-disabled {opacity: 30%!important}`;
    document.body.appendChild(swiperStyle);
    const numberOfSlides = document
      .querySelector('[swiper="thumbnails-holder"]')
      .querySelectorAll('[swiper="gallery-thumbnail"]').length - 1;
    const sliderEl = sliderComponent.querySelector('[swiper="slider"]');
    const buttonNextEl = sliderComponent.querySelector('[swiper="next-button"]');
    const buttonPrevEl = sliderComponent.querySelector('[swiper="prev-button"]');
    const scrollbarEl = sliderComponent.querySelector('[swiper="scrollbar"]');
    const paginationEl = sliderComponent.querySelector('[swiper="pagination"]');
    const swiperModule = new Swiper(sliderEl, {
      slidesPerView: 1,
      spaceBetween: 16,
      direction: 'horizontal',
      navigation: {
        nextEl: buttonNextEl,
        prevEl: buttonPrevEl,
      },
      on: {
        slideChange: function() {
          currentSlide = this.activeIndex;
          updateActiveStates(currentSlide);
        },
      },
      pagination: {
        el: paginationEl,
      },
      breakpoints: {
        0: { // From 0px
          slidesPerView: 1.4,
          spaceBetween: 16,
        },
        480: { // From 480px
          slidesPerView: 1.4,
          spaceBetween: 16,
        },
        768: { // From 768px
          slidesPerView: 1,
          spaceBetween: 16,
        },
      },
    });
    if (currentSlide == 0) {
      buttonPrevEl.classList.add('swiper-button-disabled');
    } else {
      buttonPrevEl.classList.remove('swiper-button-disabled');
    }
    document.querySelectorAll('[swiper="thumbnails-holder"]').forEach((container) =>
      container.querySelectorAll('[swiper="gallery-thumbnail"]').forEach((el, i) => {
        el.style.userSelect = 'none';
        el.addEventListener('click', (e) => {
          swiperModule.slideTo(i);
          currentSlide = i;
          updateActiveStates(currentSlide);
        });
      })
    );
    // Initial state
    updateActiveStates(0);
  });
}

function updateActiveStates(activeIndex) {
  // Update thumbnails
  document.querySelectorAll('[swiper="thumbnails-holder"]').forEach((container) =>
    container.querySelectorAll('[swiper="gallery-thumbnail"]').forEach((el, i) => {
      if (i === activeIndex) {
        el.setAttribute('swiper-state', 'active');
        el.classList.add('is-current');
      } else {
        el.removeAttribute('swiper-state');
        el.classList.remove('is-current');
      }
    })
  );
  // Update slides
  document.querySelectorAll('.swiper-slide').forEach((slide, i) => {
    if (i === activeIndex) {
      slide.classList.add('is-current');
    } else {
      slide.classList.remove('is-current');
    }
  });
}
initiateSlider();