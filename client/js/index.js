$('#form').on('submit', function(event) {
    if (!$('input[name="username"]').val()) {
        event.preventDefault();
        notify('Username can\'t be blank.');
    } 
});

$('#fakeinput').on('click', function() {
    $("#fileinput").click();
});

$('#fileinput').change(function() {
    $('#filename').text($('#fileinput')[0].files[0].name);
});