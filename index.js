$(document).ready(function() {
    let update = function() {
        let b = new Baybayin({kudlit: Kudlit[$('#kudlit').val()], ra: $('#ra')[0].checked, pamudpod: $('#pamudpod')[0].checked, conjuncts: $('#conjuncts')[0].checked});
        $('#output').val(b.convert($('#input').val()));
    };

    $('#input').on('input', update);
    $('#ra,#pamudpod,#kudlit,#conjuncts').on('change', update);
    $('#weight').on('input', function() {
        $('#output').css('font-variation-settings', "'wght' "+$(this).val());
        $('#output').css('font-weight', $(this).val());
    });

    $('#hist').on('change', function() {
        if (this.checked) {
            $('#output').css('font-feature-settings', "'hist' on");
        } else {
            $('#output').css('font-feature-settings', "'hist' off");
        }
    });

    $('#size').on('input', function() {
        $('textarea#output').css('font-size', $(this).val()+'em');
    });
});

function load(s) {
    $.get(s+'.txt', function(data) {
        $('#input').val(data);
    }, "text").fail(function() {
        alert("Failed to get data.");
    });
}
