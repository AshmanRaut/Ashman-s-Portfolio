document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide icons
  const lucide = window.lucide
  lucide.createIcons()

  // Loading screen
  const loadingScreen = document.getElementById("loading-screen")
  setTimeout(() => {
    loadingScreen.style.opacity = "0"
    setTimeout(() => {
      loadingScreen.style.display = "none"
    }, 500)
  }, 2500)

  // Spotlight effect
  const spotlight = document.getElementById("spotlight")
  document.addEventListener("mousemove", (e) => {
    const x = (e.clientX / window.innerWidth) * 100
    const y = (e.clientY / window.innerHeight) * 100
    spotlight.style.background = `radial-gradient(
        circle 280px at ${x}% ${y}%,
        rgba(32, 99, 155, 0.15) 0%,
        rgba(20, 30, 48, 0.95) 45%,
        rgba(10, 15, 24, 0.98) 100%
      )`
  })

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar")
  window.addEventListener("scroll", () => {
    if (window.scrollY > 10) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle")
  const mobileMenu = document.getElementById("mobile-menu")

  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open")
  })

  document.querySelectorAll(".mobile-link").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open")
    })
  })

  // Enhanced Scroll animations with smoother transitions
  const animateOnScroll = document.querySelectorAll(".animate-on-scroll")

  const observerOptions = {
    threshold: 0.15,
    rootMargin: "-30px",
  }

  // Observer for entering viewport with smoother animations
  const observerEnter = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target
        const animation = element.dataset.animation || "fade-in"
        const delay = element.dataset.delay || "0"

        // Add animation class
        element.classList.add(`animate-${animation}`)
        if (delay !== "0") {
          element.classList.add(`animate-delay-${delay}`)
        }

        // Start observing for exit
        observerEnter.unobserve(element)
        observerExit.observe(element)

        // Store the animation type for exit animation
        element.dataset.currentAnimation = animation
      }
    })
  }, observerOptions)

  // Observer for exiting viewport with smoother transitions
  const observerExit = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        const element = entry.target
        const animation = element.dataset.currentAnimation || "fade-in"

        // Remove entrance animation
        element.classList.remove(`animate-${animation}`)

        // Add exit animation based on entrance animation
        let exitAnimation
        switch (animation) {
          case "fade-in":
            exitAnimation = "fade-out"
            break
          case "slide-in-left":
            exitAnimation = "slide-out-left"
            break
          case "slide-in-right":
            exitAnimation = "slide-out-right"
            break
          case "scale-in":
            exitAnimation = "scale-out"
            break
          default:
            exitAnimation = "fade-out"
        }

        element.classList.add(`animate-${exitAnimation}`)

        // After animation completes, remove exit class and prepare for re-entry
        setTimeout(() => {
          element.classList.remove(`animate-${exitAnimation}`)
          observerExit.unobserve(element)
          observerEnter.observe(element)
        }, 800) // Match animation duration
      }
    })
  }, observerOptions)

  // Start observing all elements
  animateOnScroll.forEach((element) => {
    observerEnter.observe(element)
  })

  // Enhanced Carousel functionality with swipe animation
  const carousel = document.getElementById("gallery-carousel")
  if (carousel) {
    const carouselInner = carousel.querySelector(".carousel-inner")
    const carouselItems = carousel.querySelectorAll(".carousel-item")
    const prevButton = document.getElementById("carousel-prev")
    const nextButton = document.getElementById("carousel-next")
    const indicators = document.getElementById("carousel-indicators")

    let currentIndex = 0
    let previousIndex = 0
    let isAnimating = false

    // Create indicators
    carouselItems.forEach((_, index) => {
      const indicator = document.createElement("div")
      indicator.classList.add("carousel-indicator")
      if (index === 0) {
        indicator.classList.add("active")
      }
      indicator.addEventListener("click", () => {
        if (!isAnimating && currentIndex !== index) {
          goToSlide(index)
        }
      })
      indicators.appendChild(indicator)
    })

    // Update carousel with swipe animation
    function updateCarousel() {
      // Set animating flag to prevent rapid clicks
      isAnimating = true

      // Remove active and prev classes from all items
      carouselItems.forEach((item) => {
        item.classList.remove("active", "prev")
      })

      // Update indicators
      const allIndicators = indicators.querySelectorAll(".carousel-indicator")
      allIndicators.forEach((ind) => ind.classList.remove("active"))
      allIndicators[currentIndex].classList.add("active")

      // Add prev class to the previous slide
      carouselItems[previousIndex].classList.add("prev")

      // Add active class to current slide
      carouselItems[currentIndex].classList.add("active")

      // Reset animation flag after transition completes
      setTimeout(() => {
        isAnimating = false
      }, 600) // Match the CSS transition duration
    }

    // Go to specific slide
    function goToSlide(index) {
      if (isAnimating) return
      previousIndex = currentIndex
      currentIndex = index
      updateCarousel()
    }

    // Next slide
    function nextSlide() {
      if (isAnimating) return
      previousIndex = currentIndex
      currentIndex = (currentIndex + 1) % carouselItems.length
      updateCarousel()
    }

    // Previous slide
    function prevSlide() {
      if (isAnimating) return
      previousIndex = currentIndex
      currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length
      updateCarousel()
    }

    // Event listeners
    nextButton.addEventListener("click", nextSlide)
    prevButton.addEventListener("click", prevSlide)

    // Add touch swipe support
    let touchStartX = 0
    let touchEndX = 0

    carousel.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX
      },
      { passive: true },
    )

    carousel.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX
        handleSwipe()
      },
      { passive: true },
    )

    function handleSwipe() {
      if (isAnimating) return

      const swipeThreshold = 50
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - go to next slide
        nextSlide()
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - go to previous slide
        prevSlide()
      }
    }

    // Auto play
    let interval = setInterval(nextSlide, 5000)

    carousel.addEventListener("mouseenter", () => {
      clearInterval(interval)
    })

    carousel.addEventListener("mouseleave", () => {
      interval = setInterval(nextSlide, 5000)
    })

    // Initialize
    updateCarousel()
  }

  // Contact form
  const contactForm = document.getElementById("contact-form")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("name").value
      const email = document.getElementById("email").value
      const subject = document.getElementById("subject").value
      const message = document.getElementById("message").value

      // Simple validation
      if (!name || !email || !message) {
        alert("Please fill in all required fields.")
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address.")
        return
      }

      // Simulate form submission
      const submitButton = contactForm.querySelector('button[type="submit"]')
      const originalText = submitButton.textContent
      submitButton.textContent = "Sending..."
      submitButton.disabled = true

      setTimeout(() => {
        alert("Your message has been sent successfully!")
        contactForm.reset()
        submitButton.textContent = originalText
        submitButton.disabled = false
      }, 1500)
    })
  }
})

