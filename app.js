$.prototype.center = function (ratio) {
    var parent = $(this).parent();
    var W = 0,
        H = 0;

    if (parent.is("body")) {
        $("body").css("margin", 0);
        W = $(window).width();
        H = $(window).height();
    } else {
        W = parent.width();
        H = parent.height();
    }

    var length = (W <= H ? W : H) * ratio;

    parent.css({
        "padding": (H - length) / 2 + "px " + (W - length) / 2 + "px"
    });

    $(this).css({
        "width": length,
        "height": length
    });
};

function popup(parent, child) {

    parent.css("position", "relative");

    var overlay = $('<div class="overlay"></div>').css({
        "position": "absolute",
        "top": 0,
        "left": 0,
        "width": parent.width(),
        "height": parent.height(),
        "background-color": "rgba(255, 255, 255, 0.5)",
        "z-index": 100,
        "display": "none"
    });

    overlay.appendTo(parent).fadeIn('slow');
    child.appendTo(overlay);


    return overlay;
}


var ticTacToe = {
    xo: ['<i class="fa fa-close"></i>', '<i class="fa fa-circle-o"></i>'],
    index: 0,
    turn: function () {
        return this.xo[(this.index++) % 2];
    }
};

$(".cell").click(function () {
    $(this).html(ticTacToe.turn());
});


$(function () {

    $(window).resize();
    var overlay = popup($(".chessboard"), $(".settings").show());

    $("#x").click(function () {
        overlay.fadeOut('slow');
    });

    $("#o").click(function () {
        overlay.fadeOut('slow');
    });

});

$(window).resize(function () {
    var app = $(".chessboard").css("display", "block");
    var cell = $(".cell");


    if ($(window).width() < 400 || $(window).height() < 400) {
        app.center(0.8);
    } else {
        app.center(0.6);
    }


    cell.css({
        "line-height": cell.height() + 'px',
        "font-size": cell.height() * 0.7
    });

    $(".overlay").width(app.width()).height(app.height());
});