// main.js - extracted from index.html for performance optimization

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');
const tocToggle = document.getElementById('tocToggle');
const toc = document.getElementById('toc');
const tocItems = document.querySelectorAll('.toc-item');

let forceHideWidgets = false;

function setWidgetsVisibility(visible) {
    const weatherWidget = document.getElementById('weatherWidget');
    const currencyWidget = document.getElementById('currencyWidget');
    const kenyaBusinessWidget = document.getElementById('kenyaBusinessWidget');
    if (weatherWidget) weatherWidget.style.display = visible ? 'flex' : 'none';
    if (currencyWidget) currencyWidget.style.display = visible ? 'block' : 'none';
    if (kenyaBusinessWidget) kenyaBusinessWidget.style.display = visible ? 'block' : 'none';
}

function isHomeSectionVisible() {
    const home = document.getElementById("home");
    const rect = home.getBoundingClientRect();
    const isDesktop = window.innerWidth >= 768;
    return (rect.top <= window.innerHeight && rect.bottom >= 0 && isDesktop);
}

// Returns true if the scroll is before halfway through the home section
function isBeforeHomeSectionHalfway() {
    const home = document.getElementById("home");
    if (!home) return false;
    const rect = home.getBoundingClientRect();
    const homeMid = rect.top + rect.height / 2;
    // If the midpoint is above the top of the viewport, we've scrolled past halfway
    return homeMid > 0;
}

tocToggle.addEventListener('click', () => {
    toc.classList.toggle('active');
    tocToggle.innerHTML = toc.classList.contains('active') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    // Hide widgets when TOC is active, show when not (if home is visible)
    setWidgetsVisibility(!(toc.classList.contains('active')) && isHomeSectionVisible());
});

// Smooth scrolling for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        // Hide widgets and set flag if "Why Choose Verben" TOC item is clicked
        if (this.classList.contains('toc-item') && this.getAttribute('data-section') === 'features') {
            forceHideWidgets = true;
            setWidgetsVisibility(false);
        }
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            // Update active TOC item
            if (targetId !== '#home') {
                const section = targetId.substring(1);
                tocItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('data-section') === section) {
                        item.classList.add('active');
                    }
                });
            }
            // Close mobile menu if open
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
});

// Update active TOC item on scroll
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    // Header scroll effect
    if (scrollPosition > 50) {
        document.querySelector('.header').classList.add('scrolled');
    } else {
        document.querySelector('.header').classList.remove('scrolled');
    }
    // Back to top button
    const backToTop = document.getElementById('backToTop');
    if (scrollPosition > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
    // Update active TOC item
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            tocItems.forEach(item => {
                item.classList.remove('active');
                if (item.getAttribute('data-section') === sectionId) {
                    item.classList.add('active');
                }
            });
        }
    });
});

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card, .product-card, .service-card, .stat-item');
    elements.forEach((element, index) => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementPosition < windowHeight - 100) {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
};
// Set initial styles for animated elements
document.querySelectorAll('.feature-card, .product-card, .service-card, .stat-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease-out';
});
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);
// Back to top functionality
document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
// Counter animation for stats
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + "+";
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
// Initialize counters when they come into view
const counterOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
};
const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(document.getElementById('yearsCounter'), 0, 8, 1500);
            animateCounter(document.getElementById('customersCounter'), 0, 5000, 2000);
            animateCounter(document.getElementById('productsCounter'), 0, 100, 1000);
            observer.unobserve(entry.target);
        }
    });
}, counterOptions);
const aboutStats = document.querySelector('.about-stats');
if (aboutStats) {
    counterObserver.observe(aboutStats);
}
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) heroTitle.style.animation = 'fadeInUp 1s ease-out forwards';
const heroSubtitle = document.querySelector('.hero-subtitle');
if (heroSubtitle) heroSubtitle.style.animation = 'fadeInUp 1s ease-out 0.2s forwards';
const heroButtons = document.querySelector('.hero-buttons');
if (heroButtons) heroButtons.style.animation = 'fadeInUp 1s ease-out 0.4s forwards';
document.querySelector('.hero-title').style.animation = 'fadeInUp 1s ease-out forwards';
document.querySelector('.hero-subtitle').style.animation = 'fadeInUp 1s ease-out 0.2s forwards';
document.querySelector('.hero-buttons').style.animation = 'fadeInUp 1s ease-out 0.4s forwards';

// --- Widget Slide Logic ---
const slides = [
    {id: 'weatherSlide', label: 'Weather'},
    {id: 'exchangeSlide', label: 'Exchange'},
    {id: 'newsSlide', label: 'News'}
];
let currentSlide = 0;
let widgetInterval = null;
// Show/hide widget based on 3/4 scroll of home section
function checkCombinedWidgetVisibility() {
    const widget = document.getElementById('combinedWidget');
    const home = document.getElementById('home');
    if (!widget || !home) return;
    const rect = home.getBoundingClientRect();
    const isDesktop = window.innerWidth >= 768;
    // 1/2 point from the top of the home section
    const halfway = rect.top + rect.height * 0.5;
    // Show if halfway point is still visible in viewport and on desktop
    if (halfway > 0 && rect.bottom > 0 && isDesktop) {
        widget.style.display = '';
    } else {
        widget.style.display = 'none';
    }
}
window.addEventListener('scroll', checkCombinedWidgetVisibility);
window.addEventListener('resize', checkCombinedWidgetVisibility);
document.addEventListener('DOMContentLoaded', checkCombinedWidgetVisibility);
function showSlide(idx) {
    slides.forEach((slide, i) => {
        document.getElementById(slide.id).style.display = (i === idx) ? '' : 'none';
    });
    document.getElementById('widgetIndicator').textContent = slides[idx].label;
    currentSlide = idx;
}
function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
}
function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
}
document.getElementById('nextWidgetBtn').onclick = () => {
    nextSlide();
    resetWidgetInterval();
};
document.getElementById('prevWidgetBtn').onclick = () => {
    prevSlide();
    resetWidgetInterval();
};
function resetWidgetInterval() {
    if (widgetInterval) clearInterval(widgetInterval);
    widgetInterval = setInterval(nextSlide, 60000);
}
document.addEventListener('DOMContentLoaded', () => {
    showSlide(0);
    resetWidgetInterval();
});
// Optional: Swipe support for mobile
let startX = null;
document.getElementById('combinedWidget').addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
});
document.getElementById('combinedWidget').addEventListener('touchend', function(e) {
    if (startX === null) return;
    let endX = e.changedTouches[0].clientX;
    if (endX - startX > 40) { prevSlide(); resetWidgetInterval(); }
    else if (startX - endX > 40) { nextSlide(); resetWidgetInterval(); }
    startX = null;
});
// --- Weather Logic ---
const weatherIcons = {
    0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
    45: "🌫️", 48: "🌫️", 51: "🌦️", 53: "🌧️", 55: "🌧️",
    56: "❄️", 57: "❄️", 61: "🌦️", 63: "🌧️", 65: "🌧️",
    66: "❄️", 67: "❄️", 71: "🌨️", 73: "🌨️", 75: "❄️",
    77: "❄️", 80: "🌧️", 81: "🌧️", 82: "🌧️", 85: "🌨️",
    86: "🌨️", 95: "⛈️", 96: "⛈️", 99: "🌩️"
};
function fetchWeather(lat, lon) {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,rain,weather_code,wind_speed_10m`;
    fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
        const current = data.current;
        const icon = weatherIcons[current.weather_code] || "🌍";
        const temp = `${current.temperature_2m}°C`;
        const humidity = `${current.relative_humidity_2m}%`;
        const rain = `${current.rain} mm`;
        const wind = `${current.wind_speed_10m} km/h`;
        document.getElementById('weatherIcon').textContent = icon;
        document.getElementById('weatherTemp').textContent = temp;
        document.getElementById('weatherDetails').innerHTML = `Rain: ${rain}<br>Humidity: ${humidity}<br>Wind: ${wind}`;
    })
    .catch(() => {
        document.getElementById('weatherDetails').innerText = '⚠️ Unavailable';
    });
}
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
    (pos) => fetchWeather(pos.coords.latitude, pos.coords.longitude),
    () => fetchWeather(-1.2921, 36.8219)
    );
} else {
    fetchWeather(-1.2921, 36.8219);
}
// --- Exchange Logic ---
const currencyList = ['USD', 'EUR', 'GBP', 'JPY', 'INR'];
async function updateRates() {
    try {
        const url = "https://api.exchangerate.fun/latest?base=KES&symbols=USD,EUR,GBP,JPY,INR";
        const response = await fetch(url);
        const data = await response.json();
        const ratesDiv = document.getElementById("currencyRates");
        const list = currencyList.map(currency => {
            const rate = (1 / data.rates[currency]).toFixed(2);
            return `<div>1 ${currency} = ${rate} KES</div>`;
        });
        ratesDiv.innerHTML = list.join('');
    } catch (err) {
        document.getElementById("currencyRates").innerHTML = "⚠️ Error fetching rates";
        console.error(err);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    updateRates();
    setInterval(updateRates, 300000); // Refresh every 5 mins
});
// --- News Logic ---
async function loadKenyaBusinessNews() {
    try {
        const res = await fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent("https://www.standardmedia.co.ke/rss/business.php"));
        const text = await res.text();
        const doc = new DOMParser().parseFromString(text, "text/xml");
        const items = Array.from(doc.querySelectorAll("item"));
        items.sort((a, b) => new Date(b.querySelector("pubDate")?.textContent) - new Date(a.querySelector("pubDate")?.textContent));
        const top5 = items.slice(0, 5).map(item => {
            const title = item.querySelector("title")?.textContent;
            const link = item.querySelector("link")?.textContent;
            return `<li style="margin-bottom:6px;"><a href="${link}" target="_blank" style="color:white; text-decoration:none;">${title}</a></li>`;
        }).join("");
        document.getElementById("businessNewsList").innerHTML = top5 || "<li>No Business News Found.</li>";
    } catch (e) {
        document.getElementById("businessNewsList").innerHTML = "<li>⚠️ Could not load news.</li>";
        console.error(e);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    loadKenyaBusinessNews();
    setInterval(loadKenyaBusinessNews, 600000);

    // Contact Form AJAX Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formMessage = document.getElementById('contactFormMessage');
            formMessage.textContent = '';
            const formData = new FormData(contactForm);
            formMessage.innerHTML = '<span style="color:#0790E8;">Sending...</span>';
            try {
                const response = await fetch('https://formspree.io/f/mzzgoyjp', {
                    method: 'POST',
                    headers: { 'Accept': 'application/json' },
                    body: formData
                });
                if (response.ok) {
                    contactForm.reset();
                    formMessage.innerHTML = '<span style="color:green;">Thank you! Your message has been sent.</span>';
                } else {
                    const data = await response.json();
                    let errorMsg = 'Sorry, there was a problem sending your message.';
                    if (data && data.errors && data.errors.length > 0) {
                        errorMsg = data.errors.map(e => e.message).join('<br>');
                    }
                    formMessage.innerHTML = `<span style=\"color:red;\">${errorMsg}</span>`;
                }
            } catch (err) {
                formMessage.innerHTML = '<span style="color:red;">Network error. Please try again later.</span>';
            }
        });
    }
});
