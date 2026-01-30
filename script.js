document.addEventListener('DOMContentLoaded', function() {
    
    // --- ACCORDION FUNCTIONALITY ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                // Close other open accordion items
                const allContent = document.querySelectorAll('.accordion-content');
                allContent.forEach(item => { item.style.maxHeight = null; });
                accordionHeaders.forEach(otherHeader => {
                    if (otherHeader !== header) otherHeader.classList.remove('active');
                });
                // Open current item
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
    
    // --- VIDEO PLAY BUTTON LOGIC ---
    const videoWrappers = document.querySelectorAll('.video-wrapper');
    
    videoWrappers.forEach(wrapper => {
        const video = wrapper.querySelector('video');
        const playBtn = wrapper.querySelector('.custom-play-button');
        
        if (video && playBtn) {
            wrapper.addEventListener('click', function() {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            });

            video.addEventListener('play', () => {
                wrapper.classList.add('is-playing');
                video.controls = true; 
            });
            
            video.addEventListener('pause', () => {
                wrapper.classList.remove('is-playing');
            });
            
            video.addEventListener('ended', () => {
                wrapper.classList.remove('is-playing');
            });
        }
    });
    
    // --- MOBILE MENU ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
        });
    }

    // --- FORM SUBMISSION & PHONE FORMATTING ---
    const heroForm = document.getElementById('simple-hero-form');
    const heroSubmit = document.getElementById('hero-submit');
    const phoneInput = document.getElementById('hero-phone');

    // Phone formatting (US: (555) 555-5555)
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6,10)}`;
            } else if (value.length >= 3) {
                value = `(${value.slice(0,3)}) ${value.slice(3)}`;
            }
            e.target.value = value;
        });
    }

    if (heroForm) {
        heroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('hero-name').value.trim();
            const phone = document.getElementById('hero-phone').value.trim();
            
            // Collect project details from dropdown and radio buttons
            const projectSelect = document.getElementById('hero-project-select');
            const projectDetails = projectSelect ? projectSelect.value : "General Inquiry";
            
// Simplifies it since you are primarily using the dropdown now
const combinedProjectDetails = `Project: ${projectDetails}`;

            if (name && phone) {
                heroSubmit.textContent = 'Sending...';
                heroSubmit.style.backgroundColor = '#27ae60'; 
                heroSubmit.disabled = true;
                
                const ghlData = {
                    name: name,
                    phone: phone,
                    email: '',
                    source: 'Website Hero Form',
                    project_type: combinedProjectDetails,
                    budget: '',
                    timeline: 'ASAP - Promo',
                    features: '',
                    reason: 'Claimed $2500 Off Offer',
                    zip_code: ''
                };
                
                fetch('https://services.leadconnectorhq.com/hooks/jfcDigX68fpqfA6vHcYK/webhook-trigger/d000c737-69a4-4358-bc59-bf73bd337457', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(ghlData)
                })
                .then(response => {
                    if (response.ok) {
                        window.location.href = '/thank-you.html';
                    } else {
                        throw new Error('Submission failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    heroSubmit.textContent = 'Try Again';
                    heroSubmit.disabled = false;
                    heroSubmit.style.backgroundColor = ''; 
                    alert('There was an error submitting your form. Please try again or call us at (916) 892-0745.');
                });
            } else {
                alert("Please provide both a name and phone number.");
            }
        });
    }

    // --- LOCATION DETECTION ---
    setTimeout(detectUserLocation, 1000);
});

// Location Detection Functions
function detectUserLocation() {
    fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
            if (data.city && data.region) {
                updateLocationContent(data.city, data.region);
            } else {
                tryAlternativeLocationService();
            }
        })
        .catch(error => {
            console.log('Primary location service failed');
            tryAlternativeLocationService();
        });
}

function tryAlternativeLocationService() {
    fetch('https://ipapi.co/city/')
        .then(response => response.text())
        .then(city => {
            if (city && city !== 'Undefined') {
                updateLocationContent(city, 'CA');
            } else {
                updateLocationContent('Sacramento', 'CA');
            }
        })
        .catch(error => {
            updateLocationContent('Sacramento', 'CA');
        });
}

function updateLocationContent(city, state) {
    // 1. Clean up the city name (Capitalize it if the API sends lowercase)
    if (city) {
        city = city.charAt(0).toUpperCase() + city.slice(1);
    }

    // 2. Fallback if city is missing or generic
    if (!city || city === 'Your Local Area' || city === 'Undefined') {
        city = 'Sacramento';
        state = 'CA';
    }
    
    const elementsToUpdate = {
        'location-text': `Proudly Serving ${city} & Within 50 Miles`,
        'location-title': `Premium Bathroom Remodeling in ${city}`,
        'hero-city-name': city,
        'trust-signals-title': `Why ${city} Homeowners Trust MTR Baths`,
        'gallery-title': `${city} Bathroom Transformations`,
        'gallery-intro': `See how we've helped ${city} homeowners transform their outdated bathrooms. Tap any image to enlarge.`,
        'faq-title': `Questions About Your ${city} Bathroom Remodel?`,
        'final-cta-title': `Ready to Transform Your ${city} Bathroom?`,
        'final-cta-text': `Schedule your free, no-obligation bathroom consultation today in ${city}.`,
        'footer-service-areas-title': `${city} Service Areas`
    };

    for (const [id, text] of Object.entries(elementsToUpdate)) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }
    
    const footerArea = document.getElementById('footer-service-areas');
    if (footerArea) footerArea.innerHTML = `<p>${city}</p><p>And surrounding communities</p>`;
}

// --- MULTI-STEP FORM NAVIGATION ---
function nextStep(currentStep) {
    const currentDiv = document.getElementById('step-' + currentStep);
    const nextDiv = document.getElementById('step-' + (currentStep + 1));
    const progressBar = document.getElementById('form-progress-bar');
    
    if (currentStep === 1) {
        const selected = document.querySelector('input[name="project_type_radio"]:checked');
        if(!selected) {
            alert("Please select a project type to continue.");
            return;
        }
    }
    
    if (nextDiv) {
        currentDiv.classList.remove('active');
        nextDiv.classList.add('active');
        if (progressBar) {
            if(currentStep === 1) progressBar.style.width = '66%';
            if(currentStep === 2) progressBar.style.width = '100%';
        }
    }
}

function prevStep(currentStep) {
    const currentDiv = document.getElementById('step-' + currentStep);
    const prevDiv = document.getElementById('step-' + (currentStep - 1));
    const progressBar = document.getElementById('form-progress-bar');
    
    if (prevDiv) {
        currentDiv.classList.remove('active');
        prevDiv.classList.add('active');
        if (progressBar) {
            if(currentStep === 2) progressBar.style.width = '33%';
            if(currentStep === 3) progressBar.style.width = '66%';
        }
    }
}

// --- LIGHTBOX LOGIC ---
function openLightbox(imgSrc) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox && lightboxImg) {
        lightbox.style.display = "block";
        lightboxImg.src = imgSrc;
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) lightbox.style.display = "none";
}