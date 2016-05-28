$.prototype.square = function (ratio) {
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

$.prototype.rectangular = function (ratio) {
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

    var w = W * ratio,
        h = H * ratio;

    parent.css({
        "padding": (H - h) / 2 + "px " + (W - w) / 2 + "px"
    });

    $(this).css({
        "width": w,
        "height": h
    });
};

function popup(parent, child) {

    parent.css("position", "relative");

    var overlay = $(".overlay");
    if (parent.children(".overlay").length === 0) {

        overlay = $('<div class="overlay"></div>').css({
            "position": "absolute",
            "top": 0,
            "left": 0,
            "width": parent.width(),
            "height": parent.height(),
            "background-color": "rgba(255, 255, 255, 0.5)",
            "z-index": 100,
            "display": "none"
        });
        overlay.appendTo(parent);
    }
    overlay.html('');


    overlay.fadeIn('slow');
    child.appendTo(overlay).show();


    return overlay;
}


var $X = '<i class="fa fa-close"></i>',
    $O = '<i class="fa fa-circle-o"></i>',
    $cursor = $(".cursor");

var ticTacToe = {
    grid: [[null, null, null], [null, null, null], [null, null, null]],
    human: $O,
    computer: $X,
    win: false,
    full: function () {
        for (var i = 0; i < 3; ++i) {
            for (var j = 0; j < 3; ++j) {
                if (this.grid[i][j] === null)
                    return false;
            }
        }
        return true;
    },
    checkWin: function (a) {
        var grid = this.grid;
        this.win = (grid[0][0] === a && grid[0][1] === a && grid[0][2] === a) ||
            (grid[1][0] === a && grid[1][1] === a && grid[1][2] === a) ||
            (grid[2][0] === a && grid[2][1] === a && grid[2][2] === a) ||
            (grid[0][0] === a && grid[1][1] === a && grid[2][2] === a) ||
            (grid[0][2] === a && grid[1][1] === a && grid[2][0] === a) ||
            (grid[0][0] === a && grid[1][0] === a && grid[2][0] === a) ||
            (grid[0][1] === a && grid[1][1] === a && grid[2][1] === a) ||
            (grid[0][2] === a && grid[1][2] === a && grid[2][2] === a);
        return this.win;
    },
    render: function () {
        for (var r = 0; r < 3; ++r) {
            for (var c = 0; c < 3; ++c) {
                if (this.grid[r][c] !== null) {
                    var theCell = $('.cell[data-pos="' + r + ',' + c + '"]');
                    if (theCell.html().toString() === "")
                        theCell.html(this.grid[r][c]);
                }
            }
        }
    },
    clearBoard: function () {
        this.grid = [[null, null, null], [null, null, null], [null, null, null]];
        for (var r = 0; r < 3; ++r) {
            for (var c = 0; c < 3; ++c) {

                var theCell = $('.cell[data-pos="' + r + ',' + c + '"]');

                theCell.html("");

            }
        }
    },
    minimax: function (maximize, depth) {
        depth = depth || 0;
        var vector = [];
        for (var i = 0; i < 3; ++i) {
            for (var j = 0; j < 3; ++j) {
                if (this.grid[i][j] === null) {
                    this.grid[i][j] = maximize ? this.computer : this.human;
                    // for debug:
                    // document.querySelector('.cell[data-pos="' + i + ',' + j + '"]').innerText = this.grid[i][j];
                    if (this.checkWin(this.grid[i][j])) {
                        vector.push([i, j, maximize ? (10 - depth) : -(10 - depth)]);
                    } else {
                        var ret = this.minimax(!maximize, depth + 1);
                        if (ret === undefined) {
                            vector.push([i, j, 0]);
                        } else {
                            vector.push([i, j, ret[2]]);
                        }
                    }
                    this.grid[i][j] = null;
                    // for debug:
                    // document.querySelector('.cell[data-pos="' + i + ',' + j + '"]').innerText = "";
                }
            }
        }
        
        return vector.sort(function (a, b) {
            return maximize ? (b[2] - a[2]) : (a[2] - b[2]);
        })[0]; // maximum score
    },
    computerTurn: function () {
        var pos = this.minimax(true),
            x = pos[0],
            y = pos[1];
        ticTacToe.grid[x][y] = ticTacToe.computer;
        ticTacToe.render();

        if (ticTacToe.checkWin($('.cell[data-pos="' + x + ',' + y + '"]').html().toString())) {
            $(".game-over .result").html(ticTacToe.grid[x][y] + " wins!");
            popup($(".chessboard"), $(".game-over"));
        } else if (ticTacToe.full()) {
            $(".game-over .result").html("It's a draw!");
            popup($(".chessboard"), $(".game-over"));
        }
    },
    availableCell: function () {
        var available = [];
        for (var i = 0; i < 3; ++i) {
            for (var j = 0; j < 3; ++j) {
                if (this.grid[i][j] === null) {
                    available.push([i, j]);
                }
            }
        }
        return available;
    }
};


$(".cell").click(function () {
    // alert($(this).attr("data-pos"));
    var pos = $(this).attr("data-pos").split(','),
        x = pos[0],
        y = pos[1];
    ticTacToe.grid[x][y] = ticTacToe.human;
    ticTacToe.render();
    if (ticTacToe.checkWin($(this).html().toString())) {
        $(".game-over .result").html(ticTacToe.grid[x][y] + " wins!");
        popup($(".chessboard"), $(".game-over"));
    } else if (ticTacToe.full()) {
        $(".game-over .result").html("It's a draw!");
        popup($(".chessboard"), $(".game-over"));
    } else {
        ticTacToe.computerTurn();
    }

    $(".restart").click(function () {
        ticTacToe.clearBoard();
        ticTacToe.render();
        $(".overlay").css("display", "none");
    });


});


$(function () {

    $(window).resize();
    var overlay = popup($(".chessboard"), $(".settings"));

    $("#x").click(function () {
        overlay.fadeOut('slow');
        ticTacToe.human = $X;
        ticTacToe.computer = $O;
    });

    $("#o").click(function () {
        overlay.fadeOut('slow');
        ticTacToe.human = $O;
        ticTacToe.computer = $X;
        ticTacToe.computerTurn();
    });


});

$(window).resize(function () {
    var board = $(".chessboard").css("display", "block"),
        cell = $(".cell");


    if ($(window).width() < 400 || $(window).height() < 400) {
        board.square(0.8);
    } else {
        board.square(0.6);
    }


    cell.css({
        "line-height": cell.height() + 'px',
        "font-size": cell.height() * 0.7
    });

    $(".overlay").width(board.width()).height(board.height());
});