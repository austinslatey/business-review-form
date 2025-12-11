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
    document.getElementById('reviewForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const required = steps[7].querySelectorAll('[required]');
        let valid = true;
        required.forEach(field => {
            if (!field.checkValidity()) {
                field.reportValidity();
                valid = false;
            }
        });
        if (!valid) return;

        // === CALCULATE SCORE (for console + backend) ===
        let score = 0;
        const maxScore = 20;

        const mapRating = (val) => val === "Excellent" ? 5 : val === "Average" ? 3 : 1;

        const helpful = document.querySelector('input[name="how_would_you_rate_helpfulness_of_our_personnel_"]:checked');
        if (helpful) score += mapRating(helpful.value);

        const comm = document.querySelector('input[name="how_would_you_rate_our_communication_with_you_"]:checked');
        if (comm) score += mapRating(comm.value);

        const quality = document.querySelector('input[name="quality_of_service_you_received_"]:checked');
        if (quality) score += mapRating(quality.value);

        const recommend = document.querySelector('input[name="would_you_recommend_us_to_family_or_friends_"]:checked');
        if (recommend) score += recommend.value === "Yes" ? 5 : 1;

        const averageScore = (score / maxScore) * 5;


        // === SUBMIT TO SERVER ===
        const formData = new FormData(this);
        formData.append('calculated_score', averageScore.toFixed(2));

        fetch('/reviews', {
            method: 'POST',
            body: formData
        })
            .then(() => {
                // Play confetti
                confetti({ particleCount: 220, spread: 80, origin: { y: 0.6 } });

                // REPLACE ENTIRE FORM WITH FINAL THANK YOU (no buttons, no navigation)
                document.querySelector('.form-container').innerHTML = `
            <div style="text-align:center; padding:60px 20px;">
                <h2 style="font-size:42px; color:#00a651; margin-bottom:20px;">Thank You So Much!</h2>
                <p style="font-size:19px; color:#444; margin:30px 0; max-width:500px; margin-left:auto; margin-right:auto;">
                    We truly appreciate your feedback and will use it to keep improving.
                </p>
                <div style="font-size:100px; margin:40px 0;">Party</div>
                <p style="color:#666; font-size:14px;">
                    Your review has been submitted successfully.
                </p>
            </div>
        `;
            })
            .catch(() => {
                alert('Something went wrong — please try again.');
            });
    });

    // Start
    showStep(0);
});