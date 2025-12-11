// ./assets/script.js - FINAL & BULLETPROOF
document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.form-step');
    const progressFill = document.getElementById('progress');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    let currentStep = 0;

    function updateButtons() {
        // Previous: only show if not on first step
        prevBtn.style.display = currentStep === 0 ? 'none' : 'block';

        // Submit: only on personal info (step 7)
        submitBtn.style.display = currentStep === 7 ? 'block' : 'none';

        // Next button logic:
        const isTextareaStep = currentStep === 6;
        const currentStepEl = steps[currentStep];
        const hasSelection = currentStepEl && currentStepEl.querySelector('input[type="radio"]:checked');

        // Show Next if:
        // 1. It's the textarea step (step 6), OR
        // 2. We're on any radio step (0–5) AND user has already made a selection
        nextBtn.style.display = 
            isTextareaStep || (currentStep <= 5 && hasSelection)
            ? 'block' : 'none';
    }

    function showStep(n) {
        currentStep = Math.max(0, Math.min(n, steps.length - 1));

        steps.forEach((step, i) => {
            step.classList.toggle('active', i === currentStep);
        });

        progressFill.style.width = ((currentStep + 1) / (steps.length - 1) * 100) + '%';

        updateButtons();
    }

    // Previous button
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Next button
    nextBtn.addEventListener('click', () => {
        if (currentStep < steps.length - 1) {
            currentStep++;
            showStep(currentStep);
        }
    });

    // Auto-advance on new selection
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.addEventListener('change', () => {
            if (currentStep < 6) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    // Submit – with score calculation + console.log
    document.getElementById('reviewForm').addEventListener('submit', function(e) {
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

        // === CALCULATE REVIEW SCORE ===
        let score = 0;
        const maxScore = 20;

        const helpful = document.querySelector('input[name="how_would_you_rate_helpfulness_of_our_personnel_"]:checked');
        if (helpful) score += helpful.value === "Excellent" ? 5 : helpful.value === "Average" ? 3 : 1;

        const comm = document.querySelector('input[name="how_would_you_rate_our_communication_with_you_"]:checked');
        if (comm) score += comm.value === "Excellent" ? 5 : comm.value === "Average" ? 3 : 1;

        const quality = document.querySelector('input[name="quality_of_service_you_received_"]:checked');
        if (quality) score += quality.value === "Excellent" ? 5 : quality.value === "Average" ? 3 : 1;
``
        const recommend = document.querySelector('input[name="would_you_recommend_us_to_family_or_friends_"]:checked');
        if (recommend) score += recommend.value === "Yes" ? 5 : 1;

        const averageScore = (score / maxScore) * 5;

        console.log('Review Score:', averageScore.toFixed(2), '/ 5.00');
        console.log('Raw points:', score, '/ 20');

        // === SUBMIT ===
        // const formData = new FormData(this);
        // fetch('/reviews', { method: 'POST', body: formData })
        //     .then(() => {
        //         confetti({ particleCount: 220, spread: 80, origin: { y: 0.6 } });
        //         document.querySelector('.w-review-steps').innerHTML = `
        //             <div class="form-step success-step" style="text-align:center;padding:80px 0;">
        //                 <h2 style="font-size:42px;color:#00a651;">Thank You So Much!</h2>
        //                 <p style="font-size:19px;color:#555;margin:20px 0;">We truly appreciate your feedback.</p>
        //                 <div style="font-size:100px;">Celebrate</div>
        //             </div>`;
        //     })
        //     .catch(() => alert('Error submitting review'));
    });

    // Start — clean state
    showStep(0);
});