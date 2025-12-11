// ./assets/script.js - FINAL & PERFECT
document.addEventListener('DOMContentLoaded', () => {
    const steps = document.querySelectorAll('.form-step');
    const progressFill = document.getElementById('progress');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitBtn = document.getElementById('submitBtn');
    let currentStep = 0;

    function updateButtons() {
        prevBtn.style.display = currentStep === 0 ? 'none' : 'block';
        nextBtn.style.display = currentStep === 6 ? 'block' : 'none';   // textarea step
        submitBtn.style.display = currentStep === 7 ? 'block' : 'none'; // personal info

        // KEY FIX: If user went back to a radio step and a choice is already selected → show "Next" or auto-advance
        const currentStepEl = steps[currentStep];
        const hasSelection = currentStepEl.querySelector('input[type="radio"]:checked');

        if (hasSelection && currentStep < 6) {
            // If already answered → show Next button (so user can proceed with same choice)
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

    // Previous button
    prevBtn.addEventListener('click', () => {
        if (currentStep > 0) {
            currentStep--;
            showStep(currentStep);
        }
    });

    // Next button (used on textarea AND when going back to answered radio steps)
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

    // Submit
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

        const formData = new FormData(this);
        fetch('/reviews', { method: 'POST', body: formData })
        .then(() => {
            confetti({ particleCount: 220, spread: 80, origin: { y: 0.6 } });
            document.querySelector('.w-review-steps').innerHTML = `
                <div class="form-step success-step" style="text-align:center;padding:80px 0;">
                    <h2 style="font-size:42px;color:#00a651;">Thank You So Much!</h2>
                    <p style="font-size:19px;color:#555;margin:20px 0;">We truly appreciate your feedback.</p>
                    <div style="font-size:100px;">Celebrate</div>
                </div>`;
        })
        .catch(() => alert('Error submitting review'));
    });

    // Start
    showStep(0);
});