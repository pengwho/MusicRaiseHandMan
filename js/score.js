var jsScore = document.getElementById('score'); // 獲取分數區塊
var jsScoreNums = document.getElementsByClassName('number'); // 獲取分數欄位
var score = [0,0,0,0]; // 分數

function initScore() {
    score = [0,0,0,0];
    UpdateScoreView();
    jsScore.style.display = "inline";
}

function addScore( value ) {
    score[score.length-1] += value ;
    for(var i = score.length-1; i > 0; i--){
        if ( score[i] > 9 ) {
            score[i] = score[i] - 10 ;
            score[i-1] += 1 ;
        }
    }
    if (score[0] > 9) {
        score[0] = 0 ;
    }
    UpdateScoreView()
}

// 更新分數版
function UpdateScoreView() {
    for(var i =0; i < jsScoreNums.length; i++){
        jsScoreNums[i].style.left = (i * 25) + "%";
        jsScoreNums[i].style.backgroundImage = "url(./img/score/font_" + score[i] + ".png)";
        jsScoreNums[i].style.display = "inline";
    }
}
