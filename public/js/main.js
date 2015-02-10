'use strict';

$(document).ready(function() {

  var $form = $('.form');
  var $tbody = $('.tbody');
  var firebase_url = 'https://mollysfriends.firebaseio.com';

//SUBMIT FORM - PUSH DATA TO API//

  $form.submit(function(event) {
    event.preventDefault();

    var $photoURL = $('input[name="photoURL"]');
    var $firstName = $('input[name="firstName"]');
    var $lastName = $('input[name="lastName"]');
    var $phone = $('input[name="phone"]');
    var $email = $('input[name="email"]');
    var $instagram = $('input[name="instagram"]');

    var contact = {photoURL: $photoURL.val(),
            firstName: $firstName.val(),
            lastName: $lastName.val(),
            phone: $phone.val(),
            email: $email.val(),
            instagram: $instagram.val()};

    var jsonData = JSON.stringify(contact);
    var url = firebase_url + '/contact.json';
    $.post(url, jsonData, function(data) {
    });
  });


  //PULL API - ADD ROW TO TABLE//

  $.get(firebase_url + '/contact.json', function(data) {
    Object.keys(data).forEach(function(uuid){
      addRowToTable(uuid, data[uuid]);
    });
  });

  function addRowToTable(uuid, data){
    var $tr = $('<tr><td><img src="'+data.photoURL+'"></td><td>'
              + data.firstName + '</td><td>'
              + data.lastName + '</td><td>'
              + data.phone + '</td><td>'
              + data.email + '</td><td>'
              + data.instagram + '</td><td><input type="submit" class="delete" value="Delete"></td></tr>');

    $tr.attr('data-uuid', data.firstName);
   $tbody.append($tr);
  };
});
