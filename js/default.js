const jsHeadTitle = document.getElementById('headTitle'); // 標題
const jsWrapBg = document.getElementById('warpBg'); // 背景
const jsStartBtn = document.getElementById("startBtn"); // 開始按鈕
const jsStatus = document.getElementById("status"); // 顯示狀態
const jsPredicStatus = document.getElementById("predictStatus"); // 顯示預測狀態

const jsTestBtnLeft = document.getElementById("testBtnLeft");
const jsTestBtnRight = document.getElementById("testBtnRight");

const jsLeftContainer = document.getElementById("lineContainerLeft"); // left 容器 
const jsRightContainer = document.getElementById("lineContainerRight"); // right 容器

const video = document.getElementById('webcam');
const jsCanvasDraw = document.getElementById('canvasDraw');

let model = undefined;
const knnClf = knnClassifier.create();
const classes = ['A', 'B', 'C'];
const classesChinese = ['初始姿勢', '出左拳', '出右拳'];

// 設定幀率
var fps = 0.5;
// 設定1000/fps, 上一次更新的時間, 這次等待了多久
var fpsInterval, lastDrawTime, elapsed;
// 停止動畫的id
var animateRequestID;
// cancelAnimationFrame(animateRequestID);

// predictpredictpredictpredictpredictpredictpredict
// 設定幀率
var fps2 = 10;
// 設定1000/fps, 上一次更新的時間, 這次等待了多久
var fpsInterval2 = 1000 / fps2;
var lastDrawTime2 = performance.now();
var elapsed2;
// 停止動畫的id
var animateRequestID2;
// predictpredictpredictpredictpredictpredictpredict

// 節奏陣列
var rhythmList = [  [1,1,2,0],
                    [2,2,1,0],
                    [1,2,1,0],
                    [2,1,2,0]  ];
var rhythmListId = 0 ;// 使用第幾個rhythmList
var rhythmStep = rhythmList[0].length-1 ; // 走到總X拍子中的第幾拍 [0~x-1]
// 設(rhythmList[0].length-1)=X-1是因為要初始化

var blocksArrLeft = []; // 左邊區塊 array
var blocksArrRight = []; // 右邊區塊 array

// 相對高度定數值
var WrapBgH10 = jsWrapBg.offsetHeight / 10 ;
var WrapBgH3 = WrapBgH10 * 0.3 ;
var WrapBgH5 = WrapBgH10 * 0.5 ;
var WrapBgH6 = WrapBgH10 * 0.6 ;
var WrapBgH20 = WrapBgH10 * 2 ;
var WrapBgH35 = WrapBgH10 * 3.5 ;
var WrapBgH55 = WrapBgH10 * 5.5 ;
var WrapBgH115 = WrapBgH10 * 11.5 ;
// console.log(WrapBgH20);

// prepare to run animate
function startAnimating() {
    fpsInterval = 1000 / fps;
    console.log(fpsInterval);
    lastDrawTime = performance.now();
    
    // run animate
    animate();
}

// run animate
function animate(now) {
    // request another frame
    animateRequestID = requestAnimationFrame(animate);
    
    // calc elapsed time since last loop
    elapsed = now - lastDrawTime;
    
    // if enough time has elapsed, draw the next frame
    if (elapsed > fpsInterval) {
        // Get ready for next frame by setting lastDrawTime=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        lastDrawTime = now - (elapsed % fpsInterval);
        // console.log( now - lastDrawTime );

        // draw
        boxRun();
    
        // cancelAnimationFrame(requestID);
    }
}

// 處理box移動的
function boxRun() {

    // 至少要有超過一個區塊才開始trigger
    if (blocksArrLeft.length || blocksArrRight.length) {

        // 移動區塊
        for (var i = 0; i < blocksArrLeft.length; i++) {
            // 移動Left array中的相應block
            blocksArrLeft[i].moveBlock();
        }
        for (var i = 0; i < blocksArrRight.length; i++) {
            // 移動Right array中的相應block
            blocksArrRight[i].moveBlock();
        }

        // 隨機創造新的區塊
        // 做完一個rhythmList上的節奏
        // 就隨機跳往下一個rhythmList
        // rhythmStep設為零
        if (rhythmStep == rhythmList[0].length) {
            rhythmListId = baseObj.randomNum(0,rhythmList.length-1);
            rhythmStep = 0 ;
        }
        if (rhythmList[rhythmListId][rhythmStep] == 1) {
            var newBlock1 = new Block();
            newBlock1.createBlock('left');
            blocksArrLeft.push(newBlock1);
        }
        else if (rhythmList[rhythmListId][rhythmStep] == 2) {
            var newBlock2 = new Block();
            newBlock2.createBlock('right');
            blocksArrRight.push(newBlock2);
        }
        else {
        }
        // console.log("rhythmListId: " + rhythmListId + "rhythmStep: " + rhythmStep);
        rhythmStep += 1;

        // 清除超出範圍的block
        if (blocksArrLeft.length) {
            if (blocksArrLeft[0].HitBox.offsetTop < -50) {
                jsLeftContainer.removeChild(blocksArrLeft[0].HitBox);
                blocksArrLeft.shift(blocksArrLeft[0]);
            }
        }
        if (blocksArrRight.length) {
            if (blocksArrRight[0].HitBox.offsetTop < -50) {
                jsRightContainer.removeChild(blocksArrRight[0].HitBox);
                blocksArrRight.shift(blocksArrRight[0]);
            }
        }
    }
}

// 查看有沒有對上節拍
function boxOnBeats(position) {
    if ( position == 'left' || position == 1  ) {
        for (var i = 0; i < blocksArrLeft.length; i++) {
            // console.log("WrapBgH35: " + WrapBgH35 + " ,offsetTop: " + blocksArrLeft[i].HitBox.offsetTop);
            if (blocksArrLeft[i].getColor() != "yellow") {
                continue;
            }
            // 查看距離完美位置偏差多少
            var bias = Math.abs(blocksArrLeft[i].HitBox.offsetTop - WrapBgH35);
            if (bias < WrapBgH3) {
                blocksArrLeft[i].changeColor("red");
                addScore(2); // 加2分
                console.log("just!!!!");
            }
            else if (bias < WrapBgH6) {
                blocksArrLeft[i].changeColor("orange");
                addScore(1); // 加1分
                console.log("onBeats!");
            }
        }
    }
    if ( position == 'right' || position == 2 ) {
        for (var i = 0; i < blocksArrRight.length; i++) {
            // console.log("WrapBgH35: " + WrapBgH35 + " ,offsetTop: " + blocksArrRight[i].HitBox.offsetTop);
            if (blocksArrRight[i].getColor() != "yellow") {
                continue;
            }
            // 查看距離完美位置偏差多少
            var bias = Math.abs(blocksArrRight[i].HitBox.offsetTop - WrapBgH35);
            if (bias < WrapBgH3) {
                blocksArrRight[i].changeColor("red");
                addScore(2); // 加2分
                console.log("just!!!!");
            }
            else if (bias < WrapBgH6) {
                blocksArrRight[i].changeColor("orange");
                addScore(1); // 加1分
                console.log("onBeats!");
            }
        }
    }
    console.log("end!");
}

// 初始化方塊(推第一塊)
function initBlock() {
    rhythmStep = 1;
    var newBlock = new Block();
    newBlock.createBlock('left');
    blocksArrLeft.push(newBlock);
}

// start添加點擊事件處理程序
jsStartBtn.onclick = function () {
    jsHeadTitle.style.display = "none"; // 隱藏標題
    jsStartBtn.style.display = "none"; // 隱藏開始按鈕
    // jsTestBtnLeft.style.display = "inline"; // 顯示testLeft按鈕
    // jsTestBtnRight.style.display = "inline"; // 顯示testRight按鈕
    video.style.display = "inline"; // 顯示video
    initScore();
    initBlock();
    startAnimating();
};

function getUserMediaSupported() {
    /* Check if both methods exists.*/
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
}
  
if (getUserMediaSupported()) {
    // enableCam();
} else {
    console.warn('getUserMedia() is not supported by your browser');
}

function enableCam() {
    /* show the video and canvas elements */
    // getUsermedia parameters to force video but not audio.
    const constraints = {
        video: true
    };
    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            video.srcObject = stream;
            video.addEventListener('loadeddata', processVid);
        })
        .catch(function (err) {
            console.error('Error accessing media devices.', error);
        });
}

posenet.load({
    architecture: 'MobileNetV1',
    outputStride: 16,
    inputResolution: { width: 320, height: 240 },
    multiplier: 0.75
}).then((loadedModel) => {
    model = loadedModel;
    /* now model is ready to use. */
    jsStatus.innerHTML = "Model is loaded. Waiting KNN...";
    console.log("model is loaded. wait KNN...");
}).then(()=> {
    loadKnnFrozen();
    jsStatus.innerHTML = "Model is loaded. KNN is loaded.";
    console.log("Model is loaded. KNN is loaded.");
}).then(()=> {
    enableCam();
}).then(()=> {
    jsStartBtn.disabled = false;
});

function loadKnnFrozen() {
    let tensorObj = JSON.parse(knnFrozen);
    console.log(tensorObj);
    Object.keys(tensorObj).forEach((key) => {
        tensorObj[key] = tf.tensor(tensorObj[key], [tensorObj[key].length / 12, 12]);
    });
    knnClf.setClassifierDataset(tensorObj);
    console.log(knnClf.getNumClasses());
}

// testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest

// 左邊test
jsTestBtnLeft.onclick = function () {
    var newBlock = new Block();
    console.log("jsTestBtnLeft.onclick");
    newBlock.createBlock('left');
    console.log("newBlock.createBlock(left)");

    // trigger boxRun when blocksArr.length != 0
    // 所以需要把 newBlock 推入 blocksArr 開始 trigger
    blocksArrLeft.push(newBlock);
};

// 右邊test
jsTestBtnRight.onclick = function () {
    var newBlock = new Block();
    console.log("jsTestBtnRight.onclick");
    newBlock.createBlock('right');
    console.log("newBlock.createBlock(right)");

    // trigger boxRun when blocksArr.length != 0
    // 所以需要把 newBlock 推入 blocksArr 開始 trigger
    blocksArrRight.push(newBlock);
};

// keyboard test
window.addEventListener('keydown', function(e){
    // console.log(e);
    if ( e.key == "s" | e.key == "S" ) {
        boxOnBeats('left');
    }
    if ( e.key == "l" | e.key == "L" ) {
        boxOnBeats('right');
    }
});

// testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest


