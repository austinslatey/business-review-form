// ./assets/script.js - FINAL TESTING VERSION (safe for preview)
document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.form-step');
    const progressFill = document.getElementById('progress');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    let currentStep = 0;

    function updateButtons() {
        prevBtn.style.display = currentStep === 0 ? 'none' : 'block';
        nextBtn.style.display = currentStep === 6 ? 'block' : 'none';
        submitBtn.style.display = currentStep === 7 ? 'block' : 'none';

        const currentStepEl = steps[currentStep];
        const hasSelection = currentStepEl && currentStepEl.querySelector('input[type="radio"]:checked');

        if (hasSelection && currentStep <= 5) {
            nextBtn.style.display = 'block';
        }
    }

    function showStep(n) {
        currentStep = Math.max(0, Math.min(n, steps.length - 1));

        steps.forEach((step, i) => {
            step.classList.toggle('active', i === currentStep);
        });

        progressFill.style.width = ((currentStep + 1) / (steps.length - 1) * 100) + '%';

        updateButtons();
    }

    // Previous
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Next
    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });

    // Auto-advance on radio selection
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (currentStep < 6) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // SUBMIT
    // Submit — CLEAN JSON POST (production-ready)
    document.getElementById('reviewForm').addEventListener('submit', function (e) {
        e.preventDefault();

        // Validate required fields
        const required = steps[7].querySelectorAll('[required]');
        let valid = true;
        required.forEach(field => {
            if (!field.checkValidity()) {
                field.reportValidity();
                valid = false;
            }
        });
        if (!valid) return;

        // === COLLECT ALL FORM DATA INTO CLEAN JSON OBJECT ===
        const formData = {
            firstname: document.querySelector('[name="firstname"]').value.trim(),
            lastname: document.querySelector('[name="lastname"]').value.trim(),
            email: document.querySelector('[name="email"]').value.trim(),
            was_this_your_first_visit_to_waldoch: document.querySelector('[name="was_this_your_first_visit_to_waldoch"]:checked')?.value,
            how_would_you_rate_helpfulness_of_our_personnel_: document.querySelector('[name="how_would_you_rate_helpfulness_of_our_personnel_"]:checked')?.value,
            how_would_you_rate_our_communication_with_you_: document.querySelector('[name="how_would_you_rate_our_communication_with_you_"]:checked')?.value,
            quality_of_service_you_received_: document.querySelector('[name="quality_of_service_you_received_"]:checked')?.value,
            was_your_vehicle_completed_on_schedule_: document.querySelector('[name="was_your_vehicle_completed_on_schedule_"]:checked')?.value,
            would_you_recommend_us_to_family_or_friends_: document.querySelector('[name="would_you_recommend_us_to_family_or_friends_"]:checked')?.value,
            what_can_we_do_to_improve_our_service_: document.querySelector('[name="what_can_we_do_to_improve_our_service_"]').value.trim(),
            consent_marketing: document.querySelector('[name="consent_marketing"]').checked || false
        };

        // === CALCULATE SCORE ===
        let score = 0;
        const maxScore = 20;
        const mapRating = (val) => val === "Excellent" ? 5 : val === "Average" ? 3 : 1;

        if (formData.how_would_you_rate_helpfulness_of_our_personnel_) score += mapRating(formData.how_would_you_rate_helpfulness_of_our_personnel_);
        if (formData.how_would_you_rate_our_communication_with_you_) score += mapRating(formData.how_would_you_rate_our_communication_with_you_);
        if (formData.quality_of_service_you_received_) score += mapRating(formData.quality_of_service_you_received_);
        if (formData.would_you_recommend_us_to_family_or_friends_) score += formData.would_you_recommend_us_to_family_or_friends_ === "Yes" ? 5 : 1;

        const averageScore = (score / maxScore) * 5;

        console.log('Review Score:', averageScore.toFixed(2), '/ 5.00');
        console.log('Raw points:', score, '/ 20');
        console.log('Submitted Data:', formData);

        // === SEND AS JSON ===
        fetch('/https://custom-shopify.onrender.com', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) throw new Error('Network error');
                return response.json();
            })
            .then(() => {
                confetti({ particleCount: 220, spread: 80, origin: { y: 0.6 } });
                document.querySelector('.form-container').innerHTML = `
            <div style="text-align:center; padding:80px 20px;">
                <h2 style="font-size:42px; color:#00a651; margin-bottom:20px;">Thank You So Much!</h2>
                <p style="font-size:19px; color:#444; max-width:500px; margin:30px auto; line-height:1.6;">
                    We truly appreciate your feedback and will use it to keep improving.
                </p>
                <div style="font-size:100px; margin:40px 0;">🎉</div>
            </div>`;
            })
            .catch(err => {
                console.error('Submission failed:', err);
                alert('Something went wrong — please try again.');
            });
    });

    // Start
    showStep(0);
});