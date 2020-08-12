$(document).ready(function() {
    let update = function() {
        let b = new Baybayin({kudlit: Kudlit[$('#kudlit').val()], ra: $('#ra')[0].checked, pamudpod: $('#pamudpod')[0].checked});
        $('#output').val(b.convert($('#input').val()));
    };

    $('#input').on('input', update);
    $('#ra,#pamudpod,#kudlit').on('change', update);
    $('#weight').on('input', function() {
        $('#output').css('font-variation-settings', "'wght' "+$(this).val());
        $('#output').css('font-weight', $(this).val());
    });

    $('#size').on('input', function() {
        $('textarea#output').css('font-size', $(this).val()+'em');
    });
});