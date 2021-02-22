import "wicg-inert";


export function initModal() {
  const $body = document.querySelector('body');
  const $outputContainer = document.querySelector('.out');
  const $modal = document.querySelector('.modal');
  const $loginForm = document.querySelector('.login');
  const $loginBtn = document.querySelector('.header_account');
  const $modalTitle = $modal.querySelector('sectionTitle');

  $modal.inert = false;

  function openModal() {
    const loginLabels = document.querySelectorAll('.login_label');

    $modal.classList.add('modal--active');
    $body.classList.add('body--noScroll');
    document.addEventListener('keyup', initCloseModal);
    loginLabels.forEach((label) => {
      const $input = label.querySelector('.login_input');
      $input.addEventListener('blur', validateFields);
    });
    $loginForm.addEventListener('submit', submitForm);
    Array.from($outputContainer.children).forEach((child) => {
      if (!child.closest('.modal')) {
        child.inert = true;
      }
    });
    $modal.inert = false;
    $modalTitle.focus();
  }

  function initCloseModal(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  }

  function closeModal() {
    $modal.classList.remove('modal--active');
    $body.classList.remove('body--noScroll');
    Array.from($outputContainer.children).forEach((child) => {
      if (!child.closest('.modal')) {
        child.inert = false;
      }
    });
    $modal.inert = true;
    $loginBtn.focus();
    document.removeEventListener('keyup', initCloseModal);
    $loginForm.removeEventListener('submit', submitForm);
  }

  $loginBtn.addEventListener('click', ({ target }) => {
    if (target.classList.contains('header_account')) {
      openModal();
    }
  });

  function createErrorMsg(context, text) {
    const $inputLabel = context.closest('.login_label');
    const $errorMsgWrap = $inputLabel.querySelector('.login_errorMsg');

    if ($errorMsgWrap) {
      $errorMsgWrap.innerText = '';
      $errorMsgWrap.innerText = text;
    } else {
      const $error = document.createElement('span');
      context.classList.add('invalid');
      $error.classList.add('login_errorMsg');
      $error.innerText = text;
      $inputLabel.appendChild($error);
    }

    $inputLabel.classList.add('inValid');
  }

  function validateFields() {
    // debugger
    if (this.getAttribute('type') === 'text') {
      if (this.value === '') {
        const loginErrorMsg = 'Введите свой логин';
        createErrorMsg(this, loginErrorMsg);
      } else {
        setValidValue(this);
        console.log('valid text value');
        //TODO add icons on valid/invalid state
      }
    } else if( this.getAttribute('type') === 'password') {
      const pattern = /(?=^.{6,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*/;
      if (this.value === '') {
        const passwordErrorMsg = 'Введите ваш пароль';
        createErrorMsg(this, passwordErrorMsg);
      } else if (this.value !== '' && !this.value.match(pattern)) {
        const passwordErrorMsg = 'Ваш пароль должен состоять из заглавных, строчных букв, цифр и спец символов и длинной больше 6 символов';
        createErrorMsg(this, passwordErrorMsg);
      } else {
        setValidValue(this);
        console.log('valid password value');

      }
    }
  }

  function setValidValue(context) {
    const $labelWrap = context.closest('.login_label');
    const $msgWrap = $labelWrap.querySelector('.login_errorMsg');
    $msgWrap && $msgWrap.remove();
    $labelWrap.classList.remove('invalid');
    context.classList.remove('invalid');
    context.classList.add('valid');
  }

  function submitForm() {
    event.preventDefault();
    const $loginInputs = document.querySelectorAll('.login_input');
    const isValid = Array.from($loginInputs).every((input) => input.classList.contains('valid'));

    if (isValid) {
      alert('Форма успешно отправлена');
      closeModal();
    }
  }

}
