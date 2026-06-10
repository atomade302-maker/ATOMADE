document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // Elements
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const templateCards = document.querySelectorAll('.template-card');
    
    const checkboxes = document.querySelectorAll('.estimator-checkbox');
    const clientNameInput = document.getElementById('calcClientName');
    const projectNameInput = document.getElementById('calcProjectName');
    const estimateNoInput = document.getElementById('calcEstimateNo');
    const dateInput = document.getElementById('calcDate');
    
    const sheetClientName = document.getElementById('sheetClientName');
    const sheetProjectName = document.getElementById('sheetProjectName');
    const sheetDate = document.getElementById('sheetDate');
    const sheetEstimateNo = document.getElementById('sheetEstimateNo');
    const sheetTimeline = document.getElementById('sheetTimeline');
    const sheetGrandTotal = document.getElementById('sheetGrandTotal');
    
    const designSubtotal = document.getElementById('designSubtotal');
    const developmentSubtotal = document.getElementById('developmentSubtotal');
    const mediaSubtotal = document.getElementById('mediaSubtotal');
    
    const printSheetBtn = document.getElementById('printSheetBtn');
    const submitEstimateBtn = document.getElementById('submitEstimateBtn');
    
    const contactForm = document.getElementById('contactForm');
    const contactName = document.getElementById('contactName');
    const contactEmail = document.getElementById('contactEmail');
    const contactSubject = document.getElementById('contactSubject');
    const contactMessage = document.getElementById('contactMessage');
    const formSuccessMessage = document.getElementById('formSuccessMessage');
    const submitFormBtn = document.getElementById('submitFormBtn');

    // ==========================================================================
    // MOBILE NAVIGATION
    // ==========================================================================
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileNavToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });
    }

    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = mobileNavToggle.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            }
        });
    });

    // Active Navigation Highlighting on Scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // TEMPLATE SHOWCASE FILTER
    // ==========================================================================
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filterValue = btn.getAttribute('data-filter');
            
            templateCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // Animation trigger
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // CALCULATOR & INVOICE LOGIC
    // ==========================================================================
    
    // Set Current Date on Estimate Sheet and Input
    const setTodayDate = () => {
        const dateOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        const today = new Date();
        // Set dynamic date, but formatted like "24 May 2025"
        const formattedDate = today.toLocaleDateString('en-GB', dateOptions);
        if (dateInput) {
            dateInput.value = formattedDate;
        }
        sheetDate.innerText = formattedDate;
    };
    setTodayDate();

    // Update Client, Project, Estimate No, and Date Details on Sheet in Real-Time
    clientNameInput.addEventListener('input', (e) => {
        sheetClientName.innerText = e.target.value || 'Fameads';
    });

    projectNameInput.addEventListener('input', (e) => {
        sheetProjectName.innerText = e.target.value || 'Website Design & Development';
    });

    if (estimateNoInput) {
        estimateNoInput.addEventListener('input', (e) => {
            sheetEstimateNo.innerText = e.target.value || 'AT-001';
        });
    }

    if (dateInput) {
        dateInput.addEventListener('input', (e) => {
            sheetDate.innerText = e.target.value || '24 May 2025';
        });
    }

    // Checkbox cards styling and toggle triggers
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const card = checkbox.closest('.checkbox-card');
            if (checkbox.checked) {
                card.classList.add('checked');
            } else {
                card.classList.remove('checked');
            }
            updateInvoiceSheet();
        });
    });

    // Main Invoice Update Logic
    const updateInvoiceSheet = () => {
        let designSum = 0;
        let devSum = 0;
        let mediaSum = 0;
        let activeItemsCount = 0;

        checkboxes.forEach(checkbox => {
            const price = parseInt(checkbox.getAttribute('data-price'));
            const category = checkbox.getAttribute('data-category');
            const itemId = checkbox.getAttribute('data-id');
            
            // Scope Bullet element on the invoice sheet
            const bullet = document.querySelector(`li[data-scope-id="${itemId}"]`);
            // Cost breakdown sub-row on the invoice sheet
            const subRow = document.querySelector(`.sub-row[data-item-id="${itemId}"]`);

            if (checkbox.checked) {
                activeItemsCount++;
                if (bullet) bullet.classList.remove('inactive');
                if (subRow) subRow.classList.remove('inactive');

                if (category === 'design') designSum += price;
                if (category === 'development') devSum += price;
                if (category === 'media') mediaSum += price;
            } else {
                if (bullet) bullet.classList.add('inactive');
                if (subRow) subRow.classList.add('inactive');
            }
        });

        // Set subtotal values
        designSubtotal.innerText = `₹ ${designSum.toLocaleString('en-IN')}`;
        developmentSubtotal.innerText = `₹ ${devSum.toLocaleString('en-IN')}`;
        mediaSubtotal.innerText = `₹ ${mediaSum.toLocaleString('en-IN')}`;

        // Grand Total calculation
        const grandTotal = designSum + devSum + mediaSum;
        sheetGrandTotal.innerText = `₹ ${grandTotal.toLocaleString('en-IN')}`;

        // Dynamic Project Timeline Calculation
        let timelineText = '0 Working Days';
        if (activeItemsCount > 0) {
            if (activeItemsCount <= 3) {
                timelineText = '3 – 5 Working Days';
            } else if (activeItemsCount <= 7) {
                timelineText = '5 – 10 Working Days';
            } else {
                timelineText = '7 – 14 Working Days';
            }
        }
        sheetTimeline.innerText = timelineText;
    };

    // Preset Selection Bridge from Templates Showcase
    const templateSelectButtons = document.querySelectorAll('.btn-select-template');
    templateSelectButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Stop click propagation to parent cards
            const card = btn.closest('.template-card');
            const templateName = card.querySelector('.template-name').innerText;
            const category = card.getAttribute('data-category');

            // 1. Update project details text input
            projectNameInput.value = `Website Development - ${templateName} Preset`;
            sheetProjectName.innerText = projectNameInput.value;

            // 2. Adjust checkboxes matching template presets
            checkboxes.forEach(checkbox => {
                const itemId = checkbox.getAttribute('data-id');
                const checkboxCard = checkbox.closest('.checkbox-card');
                
                // Default settings for templates
                let shouldCheck = true;

                // Customize checking rules based on template type
                if (category === 'saas') {
                    // SaaS doesn't necessarily need bakery layout or CMS sync by default unless checked
                    if (itemId === 'dev-cms') shouldCheck = false;
                } else if (category === 'ecommerce') {
                    // E-commerce needs almost everything
                    shouldCheck = true;
                } else if (category === 'portfolio') {
                    // Creative portfolio might skip heavy CMS integration or simple element sections
                    if (itemId === 'dev-cms') shouldCheck = false;
                } else if (category === 'bakery') {
                    // Simple cafe site skips CMS & dynamic portfolio elements
                    if (itemId === 'dev-portfolio' || itemId === 'dev-cms') shouldCheck = false;
                }

                checkbox.checked = shouldCheck;
                if (shouldCheck) {
                    checkboxCard.classList.add('checked');
                } else {
                    checkboxCard.classList.remove('checked');
                }
            });

            // 3. Update the invoice card contents
            updateInvoiceSheet();

            // 4. Scroll smooth down to the Estimator Section
            const estimatorSection = document.getElementById('estimator');
            estimatorSection.scrollIntoView({ behavior: 'smooth' });

            // Create a small visual pulse animation on the estimate sheet to draw attention
            const estimateSheet = document.getElementById('estimateSheet');
            estimateSheet.style.animation = 'none';
            setTimeout(() => {
                estimateSheet.style.transform = 'scale(1.02)';
                estimateSheet.style.transition = 'transform 0.3s ease';
                setTimeout(() => {
                    estimateSheet.style.transform = 'scale(1)';
                }, 300);
            }, 50);
        });
    });

    // Initialize invoice values
    updateInvoiceSheet();

    // ==========================================================================
    // SAVE / PRINT PDF FUNCTIONALITY
    // ==========================================================================
    printSheetBtn.addEventListener('click', () => {
        window.print();
    });

    // ==========================================================================
    // BOOKING CONSULTATION / FORM AUTO-FILL BRIDGE
    // ==========================================================================
    submitEstimateBtn.addEventListener('click', () => {
        // Collect current estimate details
        const client = clientNameInput.value || 'Fameads';
        const project = projectNameInput.value || 'Website Design & Development';
        const totalCost = sheetGrandTotal.innerText;
        const timeline = sheetTimeline.innerText;

        // Collect checked modules names
        const modules = [];
        checkboxes.forEach(cb => {
            if (cb.checked) {
                const label = cb.closest('.checkbox-card').querySelector('strong').innerText;
                modules.push(label);
            }
        });

        // Fill out contact form fields
        contactName.value = client === 'Fameads' ? '' : client;
        contactSubject.value = `Consultation Request: ${project}`;
        
        let messageText = `Hello Atomade Team,\n\nI would like to book a consultation regarding our project: "${project}".\n\n`;
        messageText += `Here are the details from our custom estimate:\n`;
        messageText += `- Estimated Cost: ${totalCost}\n`;
        messageText += `- Delivery Timeline: ${timeline}\n\n`;
        messageText += `Selected Scope Modules:\n`;
        modules.forEach(mod => {
            messageText += `✔ ${mod}\n`;
        });
        messageText += `\nPlease let us know when we can schedule a call.`;
        
        contactMessage.value = messageText;

        // Smooth scroll to contact section
        const contactSection = document.getElementById('contact');
        contactSection.scrollIntoView({ behavior: 'smooth' });
        
        // Focus the name field
        setTimeout(() => {
            contactName.focus();
        }, 800);
    });

    // ==========================================================================
    // CONTACT FORM SUBMISSION
    // ==========================================================================
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Loading state trigger
        submitFormBtn.innerText = 'Sending Inquiry...';
        submitFormBtn.disabled = true;

        const formData = new FormData(contactForm);

        fetch('https://formsubmit.co/ajax/atomade302@gmail.com', {
            method: 'POST',
            headers: { 
                'Accept': 'application/json'
            },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Success response
            contactForm.reset();
            formSuccessMessage.style.display = 'flex';
            submitFormBtn.innerText = 'Send Royal Inquiry';
            submitFormBtn.disabled = false;
            
            // Auto hide success message after 10s
            setTimeout(() => {
                formSuccessMessage.style.opacity = '0';
                formSuccessMessage.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    formSuccessMessage.style.display = 'none';
                    formSuccessMessage.style.opacity = '1';
                }, 500);
            }, 10000);
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            submitFormBtn.innerText = 'Send Royal Inquiry';
            submitFormBtn.disabled = false;
            alert('There was an error sending your inquiry. Please try again.');
        });
    });

    // ==========================================================================
    // PORTFOLIO SLIDESHOW
    // ==========================================================================
    const slides = document.querySelectorAll('.slide');
    const prevSlideBtn = document.getElementById('prevSlideBtn');
    const nextSlideBtn = document.getElementById('nextSlideBtn');
    const sliderUrl = document.getElementById('sliderUrl');
    const slideTag = document.getElementById('slideTag');
    const slideTitle = document.getElementById('slideTitle');
    const slideSubtitle = document.getElementById('slideSubtitle');
    const slideDesc = document.getElementById('slideDesc');
    const visitLiveBtn = document.getElementById('visitLiveBtn');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentSlide = 0;
    let slideInterval;
    const intervalTime = 5000; // Auto scroll every 5s

    const showSlide = (index) => {
        if (slides.length === 0) return;
        
        // Remove active class from current slide & indicator
        slides[currentSlide].classList.remove('active');
        indicators[currentSlide].classList.remove('active');

        // Set current slide index
        currentSlide = (index + slides.length) % slides.length;

        // Add active class to new slide & indicator
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');

        // Update Details Card Content
        const activeSlide = slides[currentSlide];
        const url = activeSlide.getAttribute('data-url');
        const title = activeSlide.getAttribute('data-title');
        const subtitle = activeSlide.getAttribute('data-subtitle');
        const desc = activeSlide.getAttribute('data-desc');

        // Animate the details update
        const elementsToAnimate = [slideTitle, slideSubtitle, slideDesc, visitLiveBtn];
        elementsToAnimate.forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(5px)';
                el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
            }
        });

        setTimeout(() => {
            if (sliderUrl) sliderUrl.innerText = url;
            if (slideTitle) slideTitle.innerText = title;
            if (slideSubtitle) slideSubtitle.innerText = subtitle;
            if (slideDesc) slideDesc.innerText = desc;
            if (visitLiveBtn) visitLiveBtn.setAttribute('href', url);

            // Specific tag styling depending on project type
            if (slideTag) {
                if (currentSlide === 0) {
                    slideTag.innerText = 'MAJOR PROJECT';
                    slideTag.style.backgroundColor = 'rgba(111, 0, 255, 0.15)';
                    slideTag.style.borderColor = 'rgba(168, 85, 247, 0.3)';
                } else if (currentSlide === 1) {
                    slideTag.innerText = 'CCTV & AUTOMATION';
                    slideTag.style.backgroundColor = 'rgba(16, 185, 129, 0.15)';
                    slideTag.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                } else {
                    slideTag.innerText = 'BAKERY & RETAIL';
                    slideTag.style.backgroundColor = 'rgba(245, 158, 11, 0.15)';
                    slideTag.style.borderColor = 'rgba(245, 158, 11, 0.3)';
                }
            }

            elementsToAnimate.forEach(el => {
                if (el) {
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                }
            });
        }, 200);
    };

    const nextSlide = () => {
        showSlide(currentSlide + 1);
    };

    const prevSlide = () => {
        showSlide(currentSlide - 1);
    };

    // Button Events
    if (nextSlideBtn) {
        nextSlideBtn.addEventListener('click', () => {
            nextSlide();
            resetTimer();
        });
    }

    if (prevSlideBtn) {
        prevSlideBtn.addEventListener('click', () => {
            prevSlide();
            resetTimer();
        });
    }

    // Indicator Click Events
    indicators.forEach(indicator => {
        indicator.addEventListener('click', (e) => {
            const index = parseInt(e.target.getAttribute('data-index'));
            showSlide(index);
            resetTimer();
        });
    });

    // Auto Play Timer
    const startTimer = () => {
        slideInterval = setInterval(nextSlide, intervalTime);
    };

    const resetTimer = () => {
        clearInterval(slideInterval);
        startTimer();
    };

    // Initialize Slideshow auto scroll if elements exist
    if (slides.length > 0) {
        startTimer();
    }

    // --- Hero Code Typing Animation ---
    const typingCodeEl = document.getElementById('typingCode');
    if (typingCodeEl) {
        const codeText = `<span class="comment">// Atomade Digital Configuration</span>
<span class="keyword">const</span> <span class="variable">agency</span> = {
  name: <span class="string">"Atomade"</span>,
  standards: <span class="string">"Royal"</span>,
  pricing: <span class="string">"Democratized"</span>,
  delivery: <span class="string">"7-14 Days"</span>,
  stack: [<span class="string">"HTML5"</span>, <span class="string">"CSS3"</span>, <span class="string">"JS"</span>]
};

<span class="keyword">function</span> <span class="function">initProject</span>(<span class="variable">client</span>) {
  <span class="keyword">return</span> {
    ux: <span class="string">"Bespoke & Clean"</span>,
    responsive: <span class="keyword">true</span>,
    glow: <span class="keyword">true</span>
  };
}

<span class="comment">// Creating the Future...</span>
<span class="function">initProject</span>(<span class="string">"You"</span>);`;

        let index = 0;
        let currentHTML = "";
        const typingSpeed = 30; // ms per character

        function type() {
            if (index < codeText.length) {
                if (codeText[index] === '<') {
                    let tagEnd = codeText.indexOf('>', index);
                    if (tagEnd !== -1) {
                        currentHTML += codeText.substring(index, tagEnd + 1);
                        index = tagEnd + 1;
                    } else {
                        currentHTML += codeText[index];
                        index++;
                    }
                } else {
                    currentHTML += codeText[index];
                    index++;
                }
                typingCodeEl.innerHTML = currentHTML + '<span class="typing-cursor">|</span>';
                setTimeout(type, typingSpeed);
            } else {
                typingCodeEl.innerHTML = currentHTML + '<span class="typing-cursor blinking">|</span>';
                // Hold for 8 seconds, then restart
                setTimeout(() => {
                    index = 0;
                    currentHTML = "";
                    type();
                }, 8000);
            }
        }
        
        // Start typing after a short delay
        setTimeout(type, 1000);
    }

    // ==========================================================================
    // FLOATING REVIEW WIDGET
    // ==========================================================================
    const floatingReviewWidget = document.getElementById('floatingReviewWidget');
    const reviewWidgetToggle = document.getElementById('reviewWidgetToggle');
    const websiteReviewSlider = document.getElementById('websiteReviewSlider');
    const reviewScoreVal = document.getElementById('reviewScoreVal');
    const submitReviewBtn = document.getElementById('submitReviewBtn');

    if (floatingReviewWidget && reviewWidgetToggle && websiteReviewSlider) {
        reviewWidgetToggle.addEventListener('click', () => {
            floatingReviewWidget.classList.toggle('open');
        });

        websiteReviewSlider.addEventListener('input', (e) => {
            reviewScoreVal.innerText = e.target.value;
        });

        submitReviewBtn.addEventListener('click', () => {
            submitReviewBtn.innerText = 'Submitting...';
            submitReviewBtn.disabled = true;

            const score = websiteReviewSlider.value;
            const formData = new FormData();
            formData.append('_subject', 'New Website Review Received');
            formData.append('Review_Score', score + '/10');
            formData.append('Message', 'A visitor has rated your website ' + score + ' out of 10 using the floating review widget.');

            fetch('https://formsubmit.co/ajax/atomade302@gmail.com', {
                method: 'POST',
                headers: { 
                    'Accept': 'application/json'
                },
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                submitReviewBtn.innerText = 'Thank You!';
                submitReviewBtn.style.background = '#10b981';
                setTimeout(() => {
                    floatingReviewWidget.classList.remove('open');
                    setTimeout(() => {
                        submitReviewBtn.innerText = 'Submit Rating';
                        submitReviewBtn.disabled = false;
                        submitReviewBtn.style.background = '';
                    }, 500);
                }, 2000);
            })
            .catch(error => {
                console.error('Error submitting review:', error);
                submitReviewBtn.innerText = 'Submit Rating';
                submitReviewBtn.disabled = false;
            });
        });
    }
});
