'use strict';

$(document).ready(function() {

  var $form = $('.form');
  var $tbody = $('.tbody');
  var firebase_url = 'https://mollysfriends.firebaseio.com';

//DELETE CONTACTS//

  $($tbody).on('click', '.delete', function(event){
    event.preventDefault();

    var $tr = $(event.target).closest('tr');
    var uuid = $tr.data('uuid');

    $tr.remove();
    deleteContactFromFirebase(uuid);
  });

  function deleteContactFromFirebase(uuid) {
     var url = firebase_url + '/contact/' + uuid + '.json';
     $.ajax(url, {type: 'DELETE'});
  };

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

    var $tr = $('<tr><td><img src="'+ $photoURL.val() +'"></td><td>'
              + $firstName.val() + '</td><td>'
              + $lastName.val() + '</td><td>'
              + $phone.val() + '</td><td>'
              + $email.val() + '</td><td>'
              + $instagram.val() + '</td><td><input type="submit" class="delete" value="Delete"></td></tr>');

    var jsonData = JSON.stringify(contact);
    var url = firebase_url + '/contact.json';
    $.post(url, jsonData, function(data) {
       $tr.attr('data-uuid', data.name);
       console.log(data.name);
       $tbody.append($tr);
    });

    $photoURL.val('');
    $firstName.val('');
    $lastName.val('');
    $phone.val('');
    $email.val('');
    $instagram.val('');

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

    $tbody.append($tr);
  };
});
