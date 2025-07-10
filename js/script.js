document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('header nav ul li a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent default anchor click behavior

            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Adjust scroll position to account for fixed header
                const headerOffset = document.querySelector('header').offsetHeight;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // -20 for a little extra padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Close mobile menu after clicking a link
                if (document.body.classList.contains('nav-open')) {
                    toggleNavMenu();
                }
            }
        });
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('header nav ul');
    const body = document.body;

    const toggleNavMenu = () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        body.classList.toggle('nav-open'); // Add class to body to prevent scroll
    };

    navToggle.addEventListener('click', toggleNavMenu);

    // Close mobile nav when clicking outside (optional, but good UX)
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target) && navMenu.classList.contains('active')) {
            toggleNavMenu();
        }
    });

    // Highlight active navigation link on scroll
    const sections = document.querySelectorAll('main section');
    const navLinks = document.querySelectorAll('header nav ul li a');

    const highlightNavLink = () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - document.querySelector('header').offsetHeight - 50; // Adjust for header height and offset
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', highlightNavLink);
    highlightNavLink(); // Call on load to set initial active link

    // Update current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Form Submission Handling (Client-side validation & AJAX)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission

            formStatus.textContent = 'Mengirim pesan...';
            formStatus.style.color = 'var(--primary-color)';

            const formData = new FormData(this);
            const data = Object.fromEntries(formData.entries());

            try {
                // Replace 'your_server_endpoint' with your actual server endpoint for form submission
                // For a simple static site, you might use a service like Formspree.io or Netlify Forms.
                // Example for Formspree: action="https://formspree.io/f/your_form_id"
                const response = await fetch(this.action, {
                    method: this.method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    formStatus.textContent = 'Pesan berhasil dikirim! Terima kasih.';
                    formStatus.style.color = 'var(--accent-color)';
                    this.reset(); // Clear the form
                } else {
                    const errorData = await response.json();
                    formStatus.textContent = `Gagal mengirim pesan: ${errorData.message || 'Terjadi kesalahan.'}`;
                    formStatus.style.color = 'red';
                }
            } catch (error) {
                console.error('Error submitting form:', error);
                formStatus.textContent = 'Terjadi kesalahan jaringan atau server. Coba lagi nanti.';
                formStatus.style.color = 'red';
            }
        });
    }
});