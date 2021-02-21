export function initModal() {
  const $body = document.querySelector('body');
  const $modal = document.querySelector('.modal');
  const $loginForm = document.querySelector('.login');
  const $loginBtn = document.querySelector('.header_account');

  function openModal() {
    const loginLabels = document.querySelectorAll('.login_label');
    $modal.classList.add('modal--active');
    $body.classList.add('body--noScroll');
    document.addEventListener('keyup', initCloseModal);
    loginLabels.forEach((label) => {
      const $input = label.querySelector('.login_input');
      $input.addEventListener('blur', validateFields);
    });
  }

  function initCloseModal(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  function closeModal() {
    $modal.classList.remove('modal--active');
    $body.classList.remove('body--noScroll');
    document.removeEventListener('keyup', initCloseModal);
    $loginForm.removeEventListener('submit', submitForm);
  }

  $loginBtn.addEventListener('click', ({ target }) => {
    if (target.classList.contains('header_account')) {
      openModal();
      $loginForm.addEventListener('submit', submitForm);
    }
  });

  function createErrorMsg(context, text) {
    const $inputLabel = context.closest('.login_label');
    const $error = document.createElement('span');
    context.classList.add('invalid');
    $error.classList.add('login_errorMsg');
    $error.innerText = text;
    $inputLabel.classList.add('inValid');
    $inputLabel.appendChild($error);
  }

  function validateFields() {
    if (this.getAttribute('type') === 'text') {
      if (this.value === '') {
        const loginErrorMsg = 'Введите свой логин';
        createErrorMsg(this, loginErrorMsg);
      } else {
        this.closest('.login_label').classList.remove('invalid');
        this.classList.remove('invalid');
        this.classList.add('valid');
        console.log('valid value');
        //TODO add icons on valid/invalid state
      }
    } else if( this.getAttribute('type') === 'password') {
      // const $inputLabel = document.querySelector('.login_label--password');
      // $passwordLabel.append(`<span class="login_errorMsg">${loginErrorMsg}</span>`)
      // this.classList.add('valid');
    }
  }

  function submitForm(e) {
    e.preventDefault();
    const $loginInputs = document.querySelectorAll('.login_input');
    const $submitBtn = document.querySelectorAll('.login_submit');

    const isValid = $loginInputs.every((input) => input.classList.contains('valid'));

    isValid && $submitBtn.removeAttribute('disable');

    alert('Форма успешно отправлена');
    closeModal();
  }

}
