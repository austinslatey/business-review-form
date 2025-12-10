// ./assets/script.js
const steps = document.querySelectorAll('.form-step');
const progressFill = document.getElementById('progress');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const submitBtn = document.getElementById('submitBtn');
let currentStep = 0;

// Auto-advance when any radio button is selected (except personal-info step)
function autoAdvanceIfRadio() {
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            // Only auto-advance if we're NOT on the last step (personal info)
            if (currentStep < steps.length - 2) {  // -2 because success step is last
                currentStep++;
                showStep(currentStep);
            }
        });
    });
}

function showStep(n) {
    steps.forEach(s => s.classList.remove('active'));
    steps[n].classList.add('active');

    const progressPercentage = ((n + 1) / (steps.length - 1)) * 100; // -1 because success step doesn't count
    progressFill.style.width = progressPercentage + '%';

    // Buttons
    prevBtn.style.display = n === 0 ? 'none' : 'block';
    nextBtn.style.display = (n >= steps.length - 2) ? 'none' : 'block'; // hide Next on personal info
    submitBtn.style.display = (n === steps.length - 2) ? 'block' : 'none';
}

function validateStep() {
    const current = steps[currentStep];
    const required = current.querySelectorAll('input[required], textarea[required]');
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

// Next / Previous buttons (still work for textarea step & going back)
nextBtn.onclick = () => {
    if (validateStep()) {
        currentStep++;
        showStep(currentStep);
    }
};

prevBtn.onclick = () => {
    currentStep--;
    showStep(currentStep);
};

// Form submit
document.getElementById('reviewForm').onsubmit = function (e) {
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
                <div style="font-size:100px;">Celebrate</div>
            </div>`;
        })
        .catch(err => {
            console.error(err);
            alert('Submission failed — please try again.');
        });
};

// Initialize
showStep(0);
autoAdvanceIfRadio(); // activate auto-advance