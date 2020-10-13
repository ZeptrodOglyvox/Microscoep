$('#form').on('submit', function(event) {
    if (!$('input[name="username"]').val()) {
        event.preventDefault();
        notify('Username can\'t be blank.');
    } 
});