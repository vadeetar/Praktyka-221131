$(document).ready(function(){
  // Инициализация слайдера
  $('.slider').slick({
    autoplay: true,
    dots: true
  });

  // Обработка скролла для шапки
  $(window).on('scroll', function() {
    if ($(this).scrollTop() > 50) {
      $('.header').addClass('scrolled');
    } else {
      $('.header').removeClass('scrolled');
    }
  });

  // Функции для модального окна авторизации
  window.showAuthModal = function() {
    $('#authModal').fadeIn();
    $('#authModalContent').fadeIn().css('display', 'block');
    $('#authMessage').hide(); // Скрываем предыдущие сообщения
  };

  window.hideAuthModal = function() {
    $('#authModal').fadeOut();
    $('#authModalContent').fadeOut();
  };

  // Закрытие модального окна при клике вне его
  $('#authModal').click(function(e) {
    if (e.target === this) {
      hideAuthModal();
    }
  });

  // Обработка формы входа
  $('#loginForm').submit(function(e) {
    e.preventDefault();
    const form = $(this);
    const submitBtn = form.find('button[type="submit"]');
    
    submitBtn.html('<span class="spinner-border spinner-border-sm"></span> Вход...');
    submitBtn.prop('disabled', true);
    
    $.ajax({
      url: 'php/process_login.php',
      type: 'POST',
      data: form.serialize(),
      dataType: 'json',
      success: function(response) {
        if (response.success) {
          showSuccessMessage($('#authMessage'), response.message);
          setTimeout(() => {
            hideAuthModal();
            window.location.reload(); // Обновляем страницу после входа
          }, 1500);
        } else {
          showErrorMessage($('#authMessage'), response.message);
        }
      },
      error: function(xhr) {
        showErrorMessage($('#authMessage'), 'Ошибка сервера: ' + xhr.status);
      },
      complete: function() {
        submitBtn.html('Login');
        submitBtn.prop('disabled', false);
      }
    });
  });

  // Обработка формы регистрации
  $('#registerForm').submit(function(e) {
    e.preventDefault();
    const form = $(this);
    const submitBtn = form.find('button[type="submit"]');
    const password = form.find('input[name="password"]').val();
    const confirmPassword = form.find('input[name="confirmPassword"]').val();
    
    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      showErrorMessage($('#authMessage'), 'Пароли не совпадают!');
      return false;
    }
    
    submitBtn.html('<span class="spinner-border spinner-border-sm"></span> Регистрация...');
    submitBtn.prop('disabled', true);
    
    $.ajax({
      url: 'php/process_register.php',
      type: 'POST',
      data: form.serialize(),
      dataType: 'json',
      success: function(response) {
        if (response.success) {
          showSuccessMessage($('#authMessage'), response.message);
          form[0].reset();
          // Автоматически заполняем email в форме входа
          $('#loginForm input[name="email"]').val(form.find('input[name="email"]').val());
        } else {
          showErrorMessage($('#authMessage'), response.message);
        }
      },
      error: function(xhr) {
        showErrorMessage($('#authMessage'), 'Ошибка сервера: ' + xhr.status);
      },
      complete: function() {
        submitBtn.html('Register');
        submitBtn.prop('disabled', false);
      }
    });
  });

  // Обработка формы бронирования
  $('#bookingForm').submit(function(e) {
    e.preventDefault();
    
    const formData = $(this).serialize();
    const submitBtn = $('#submitBtn');
    const messageDiv = $('#formMessage');
   
    // Показываем индикатор загрузки
    submitBtn.html('<span class="spinner-border spinner-border-sm"></span> Processing...');
    submitBtn.prop('disabled', true);
    
    // Отправляем AJAX-запрос
    $.ajax({
      url: 'php/process_booking.php',
      type: 'POST',
      data: formData,
      dataType: 'json',
      success: function(response) {
        if (response.success) {
          showSuccessMessage(messageDiv, response.message);
          $('#bookingForm')[0].reset();
        } else {
          showErrorMessage(messageDiv, response.message);
        }
      },
      error: function(xhr, status, error) {
        showErrorMessage(messageDiv, 'Error: ' + error);
      },
      complete: function() {
        resetSubmitButton(submitBtn);
        autoHideMessage(messageDiv);
      }
    });
  });

  // Обработка формы Contact Us
  console.log($('#contactForm').length);
  $('#contactForm').submit(function(e) {
    e.preventDefault();
    console.log("Форма отправлена!"); // Проверка срабатывания

    const form = $(this);
    const submitBtn = $('#contactSubmit');
    const messageBox = $('#contactMessageBox');
    
    // Проверяем валидность формы
    if (!form[0].checkValidity()) {
      form.find(':input').each(function() {
        if (!this.checkValidity()) {
          $(this).addClass('is-invalid');
        }
      });
      return false;
    }
    
    // Показываем индикатор загрузки
    submitBtn.html('<span class="spinner-border spinner-border-sm"></span> Отправка...');
    submitBtn.prop('disabled', true);
    
    // Отправляем данные через AJAX
    $.ajax({
      url: 'php/process_contact.php',
      type: 'POST',
      data: form.serialize(),
      dataType: 'json',
      success: function(response) {
        if (response.success) {
          showSuccessMessage(messageBox, response.message);
          form[0].reset();
        } else {
          showErrorMessage(messageBox, response.message);
        }
      },
      error: function(xhr, status, error) {
        showErrorMessage(messageBox, 'Ошибка соединения: ' + error);
      },
      complete: function() {
        resetSubmitButton(submitBtn, 'SEND MESSAGE');
        autoHideMessage(messageBox);
      }
    });
  });

  // Сбрасываем ошибки валидации при вводе
  $('#contactForm input, #contactForm textarea').on('input', function() {
    $(this).removeClass('is-invalid');
  });

  // Вспомогательные функции
  function showSuccessMessage(element, message) {
    element.removeClass('alert-danger')
           .addClass('alert-success')
           .html(message)
           .fadeIn();
  }

  function showErrorMessage(element, message) {
    element.removeClass('alert-success')
           .addClass('alert-danger')
           .html(message)
           .fadeIn();
  }

  function resetSubmitButton(button, defaultText = 'Book Now') {
    button.html(defaultText);
    button.prop('disabled', false);
  }

  function autoHideMessage(element) {
    setTimeout(function() {
      element.fadeOut();
    }, 5000);
  }
});