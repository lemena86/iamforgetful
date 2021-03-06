var API_ENDPOINT = "YOUR_API_ENDPOINT";
$(function () {
  $("#inputDate").datepicker({ minDate: 0, maxDate: 364 });
  $("#inputDate").datepicker().datepicker("setDate", new Date());
  var d = new Date();
  var v = new Date();
  v.setMinutes(d.getMinutes() + 15);
  $("#inputTime").timepicker({
    timeFormat: "h:mm p",
    interval: 10,
    minTime: v,
    startTime: v,
    defaultTime: v,
    dynamic: false,
    dropdown: true,
    scrollbar: true,
  });
  $(".gridRadios").change(function () {
    switch ($(this).val()) {
      case "email":
        $("#email-group").removeClass("d-none");
        $("#phone-group").addClass("d-none");
        break;
      case "sms":
        $("#email-group").addClass("d-none");
        $("#phone-group").removeClass("d-none");
        break;
    }
  });
  $("#btn-send").click(function () {
    $(".alert-danger").addClass("d-none");
    $(".alert-success").addClass("d-none");
    inputDate = $("#inputDate").val();
    inputTime = $("#inputTime").val();
    inputMessage = $("#inputMessage").val();
    radio = $(".gridRadios:checked").val();
    inputEmail = $("#inputEmail").val();
    inputPhone = $("#inputPhone").val();

    var isValid = true;
    if (inputDate == "" || inputTime == "" || inputMessage == "") {
      isValid = false;
    }
    if (radio == "email" && (inputEmail == "" || !isEmail(inputEmail))) {
      isValid = false;
    }
    if (radio == "sms" && (inputPhone == "" || !isPhone(inputPhone))) {
      isValid = false;
    }

    if (!isValid) {
      $(".alert-danger").removeClass("d-none");
      return;
    }

    var strDate = inputDate + "," + inputTime;
    var selectedDate = new Date(strDate);
    var waitSeconds = (selectedDate - new Date()) / 1000;
    if (waitSeconds < 0) {
      $(".alert-danger").removeClass("d-none");
      $(".alert-danger p").text("Fecha y hora debe ser posterior a la actual");
      return;
    }
    waitSeconds = Math.round(waitSeconds);

    sendData(
      inputDate,
      inputTime,
      waitSeconds,
      inputMessage,
      radio,
      inputEmail,
      inputPhone
    );
  });

  function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
  function isPhone(phno) {
    var regexPattern = new RegExp(/^[0-9-+]+$/);
    return regexPattern.test(phno);
  }

  function sendData(
    date,
    time,
    waitSeconds,
    message,
    preference,
    email,
    phone
  ) {
    fetch(API_ENDPOINT, {
      headers: {
        "Content-type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        waitSeconds,
        preference,
        message,
        email,
        phone,
      }),
      mode: "cors",
    })
      .then((resp) => resp.json())
      .then(function (data) {
        $(".alert-success").removeClass("d-none");
        $("#send-time").text(date + " a las " + time);
      })
      .catch(function (err) {
        $(".alert-danger").removeClass("d-none");
        $(".alert-danger p").text("Ha ocurrido un error :(");
      });
  }
});
