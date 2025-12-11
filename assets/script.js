// ./assets/script.js
const steps = document.querySelectorAll('.form-step');
const progressFill = document.getElementById('progress');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
let currentStep = 0;

// Auto-advance on any radio selection (all except textarea & personal info)
document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
        if (currentStep < steps.length - 3) {  // Auto-advance only before textarea step
            currentStep++;
            showStep(currentStep);
        }
    });
});

function showStep(n) {
    steps.forEach(s => s.classList.remove('active'));
    steps[n].classList.add('active');

    const progressPercentage = ((n + 1) / (steps.length - 1)) * 100;
    progressFill.style.width = progressPercentage + '%';

    // Button logic
    prevBtn.style.display = n === 0 ? 'none' : 'block';

    // Show Next ONLY on the improvement textarea step (step index 6)
    const isImprovementStep = n === 6;
    const isPersonalInfoStep = n === 7;  // last question step

    nextBtn.style.display = isImprovementStep ? 'block' : 'none';
    submitBtn.style.display = isPersonalInfoStep ? 'block' : 'none';
}

function validateStep() {
    const current = steps[currentStep];
    const required = current.querySelectorAll('input[required]');
    let valid = true;

    required.forEach(field => {
        if (!field.checkValidity()) {
            field.style.borderColor = '#ef4444';
            field.reportValidity();
            valid = false;
        } else {
            field.style.borderColor = '#e2e8f0';
        }
    });
    return valid;
}

// Next button click (only used for improvement step)
nextBtn.onclick = () => {
    currentStep++;
    showStep(currentStep);
};

prevBtn.onclick = () => {
    currentStep--;
    showStep(currentStep);
};

document.getElementById('reviewForm').onsubmit = function(e) {
    e.preventDefault();
    if (!validateStep()) return;

    const formData = new FormData(this);

    fetch('/reviews', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(() => {
        confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });

        document.querySelector('.w-review-steps').innerHTML = `
            <div class="form-step success-step" style="text-align:center;padding:80px 0;">
                <h2 style="font-size:42px;color:var(--primary);">Thank You So Much!</h2>
                <p style="font-size:19px;color:#555;margin:20px 0;">We truly appreciate your feedback.</p>
                <div style="font-size:100px;">🎉</div>
            </div>`;
    })
    .catch(err => {
        console.error(err);
        alert('Submission failed — please try again.');
    });
};

// Init
showStep(0);