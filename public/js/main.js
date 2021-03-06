/* jshint browser: true, jquery: true */

'use strict';

//var $ = require('jquery');
//var _ = require('lodash');
//var Firebase = require('firebase');

$(document).ready(function() {

  var $form = $('.form');
  var $tbody = $('.tbody');
  var firebase_url = 'https://mollysfriends.firebaseio.com';
  var fb = new Firebase(firebase_url);
  var usersFirebaseUrl;

  //LOGIN AND MAKE PULL FROM API//
  if(fb.getAuth()) {
    $('.login').hide();
    //$('.app').toggleClass('hidden');

    usersFirebaseUrl = firebase_url + '/users/' + fb.getAuth().uid + '/data';

    $.get(usersFirebaseUrl + '/contact.json?auth=' + fb.getAuth().token, function(data) {
      if (data) {
        Object.keys(data).forEach(function(uuid){
          addRowToTable(uuid, data[uuid]);
        });
      }
    });
  }

  //REGISTER .CLICK FUNCTION//

  $('.login input[type="button"]').click(function(event) {
    var email = $('#email').val();
    var pass = $('#password').val();
    var data = {email: email, password: pass};

    registerAndLogin(data, function(err, auth) {
      if (err) {
        $('.error').text(err);
      } else {
        location.reload(true);
      }
    });
  });

  //REGISTER AND LOGIN FUNCTION//
  function registerAndLogin(obj, cb) {
    fb.createUser(obj, function(err) {
      if (!err) {
        fb.authWithPassword(obj, function(err, auth) {
          if (!err) {
            cb(null, auth);
          } else {
            cb(err);
          }
        });
      } else {
        cb(err);
      }
    });
  }

  //LOGIN .SUBMIT FUNCTION//

  $('.login form').submit(function(event) {
    event.preventDefault();

    var $loginForm = $(event.target);
    var email = $loginForm.find('[type="email"]').val();
    var pass = $loginForm.find('[type="password"]').val();
    var data = {email: email, password: pass};

    fb.authWithPassword(data, function(err, auth) {
      if (err) {
        $('.error').text(err);
      } else {
        location.reload(true);
      }
    });
  });

//HIDE FORM//
  $('.hidden form').hide();

//ADD NEW CONTACT//
  $('#newContact').click(function(event) {
    event.preventDefault();
    $('.hidden form').show();
  });

//DELETE CONTACTS//

  $($tbody).on('click', '.delete', function(event){
    event.preventDefault();

    var $tr = $(event.target).closest('tr');
    var uuid = $tr.data('uuid');

    $tr.remove();
    deleteContactFromFirebase(uuid);
  });

  function deleteContactFromFirebase(uuid) {
     var url = usersFirebaseUrl + '/contact/' + uuid + '.json?auth=' + fb.getAuth().token;
     $.ajax(url, {type: 'DELETE'});
  };

//SUBMIT FORM - PUSH DATA TO API//

  $('.app form').submit(function(event) {
    event.preventDefault();

    var $photoURL = $('input[name="photoURL"]');
    var $firstName = $('input[name="firstName"]');
    var $lastName = $('input[name="lastName"]');
    var $phone = $('input[name="phone"]');
    var $email = $('input[name="emailaddress"]');
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
    var url = usersFirebaseUrl + '/contact.json?auth=' + fb.getAuth().token;
    $.post(url, jsonData, function(data) {
       $tr.attr('data-uuid', data.name);
       $tbody.append($tr);
    });

    $photoURL.val('');
    $firstName.val('');
    $lastName.val('');
    $phone.val('');
    $email.val('');
    $instagram.val('');

    $('.hidden form').hide();
  });

  //ADD ROW TO TABLE FUNCTION//
  function addRowToTable(uuid, data){
    var $tr = $('<tr><td><img src="'+data.photoURL+'"></td><td>'
              + data.firstName + '</td><td>'
              + data.lastName + '</td><td>'
              + data.phone + '</td><td>'
              + data.email + '</td><td>'
              + data.instagram + '</td><td><input type="submit" class="delete" value="Delete"></td></tr>');
    $tbody.append($tr);
  };

  //LOGOUT FUNCTION//
  $('.logout').click(function logout(){
    fb.unauth();
    location.reload(true);
  });
});
