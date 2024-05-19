document.addEventListener('DOMContentLoaded', function() {
    const signinBtn = document.querySelector('.signinBtn');
    const signupBtn = document.querySelector('.signupBtn');
    const signinform = document.querySelector('.signinform');
    const signupform = document.querySelector('.signupform');

    signinBtn.addEventListener('click', () => {
        signinform.classList.add('active');
        signupform.classList.remove('active');
    });

    signupBtn.addEventListener('click', () => {
        signupform.classList.add('active');
        signinform.classList.remove('active');
    });
});
