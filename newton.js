// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission handling (Formspree)
document.getElementById('applicationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    fetch("https://formspree.io/f/mpwdgabe", {
        method: "POST",
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('successMessage').style.display = 'block';
            form.reset();
            document.getElementById('successMessage').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            setTimeout(() => {
                document.getElementById('successMessage').style.display = 'none';
            }, 5000);
        } else {
            alert("Form submission failed. Please try again.");
        }
    })
    .catch(error => {
        console.error('Form error:', error);
        alert("There was an error submitting the form.");
    });
});

// Add scroll effect to header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    updateCounter();
}

// Trigger counter animation when stats section is visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statItems = entry.target.querySelectorAll('.stat-item h3');
            statItems.forEach(item => {
                const text = item.textContent;
                let number = parseInt(text.replace(/\D/g, ''));
                if (text.includes('M')) number *= 1000000;
                if (text.includes('K')) number *= 1000;
                if (text.includes('%')) {
                    item.textContent = '0%';
                    animateCounter(item, parseInt(text), 1500);
                    item.textContent = number + '%';
                } else {
                    item.textContent = '0';
                    animateCounter(item, number, 2000);
                    if (text.includes('M')) {
                        setTimeout(() => {
                            item.textContent = (number / 1000000) + 'M+';
                        }, 2100);
                    } else if (text.includes('K')) {
                        setTimeout(() => {
                            item.textContent = (number / 1000) + 'K+';
                        }, 2100);
                    } else if (text.includes('/')) {
                        setTimeout(() => {
                            item.textContent = '24/7';
                        }, 2100);
                    } else {
                        setTimeout(() => {
                            item.textContent = number + '+';
                        }, 2100);
                    }
                }
            });
            observer.unobserve(entry.target);
        }
    });
});

observer.observe(document.querySelector('.stats'));
