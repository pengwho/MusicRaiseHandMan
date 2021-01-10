function Block() {

    // 音樂方塊
    this.HitBox = null;

    // 用来生成Div的方法
    this.createDiv = function (url, positionType, left, top) {
        // 創建 div
        var newDiv = document.createElement("div");
        // 設置 div 區塊樣式
        newDiv.style.width = "100px";
        newDiv.style.height = "100px";
        newDiv.style.position = positionType;
        newDiv.style.transform= "translate(-50%, -50%)";
        newDiv.style.left = left;
        newDiv.style.top = top;
        newDiv.style.background = url;
        // newDiv.style.backgroundRepeat="no-repeat";
        // newDiv.style.backgroundImage = "yellow";
        // newDiv.style.backgroundPositionY = f;
        return newDiv;
    };

    // 生成區塊
    this.createBlock = function ( position ) {
        if ( position == 'left' ) {
            // 生成左邊HitBox
            this.HitBox = this.createDiv("yellow", "absolute", "50%", WrapBgH115+"px");
            // 將區塊加入左邊Container
            jsLeftContainer.appendChild(this.HitBox);
        }
        if ( position == 'right' ) {
            // 生成右邊HitBox
            this.HitBox = this.createDiv("yellow", "absolute", "50%", WrapBgH115+"px");
            // 將區塊加入右邊Container
            jsRightContainer.appendChild(this.HitBox);
        }
    };

    // 控制區塊移動
    this.moveBlock = function () {
        // pos1原位置, pos2新位置
        var pos1 = this.HitBox.offsetTop;
        var pos2 = this.HitBox.offsetTop - WrapBgH20;

        // 這裡是用web-animations.min.js得以實現
        this.HitBox.animate(boxAnimation(pos1, pos2), {
            duration: fpsInterval,
            fill: 'forwards',
            easing: 'ease-in-out'
        });
    };

    // 更換顏色
    this.changeColor = function ( color ) {
        this.HitBox.style.background = color;
    };

    // 取得顏色
    this.getColor = function () {
        return this.HitBox.style.background;
    };

    // 還沒用到
    this.createEnd = function () {
        restart.onclick = function () {
            window.location.href = "index.html"
        }
    }
}

var baseObj = {
    // 生成隨機數
    randomNum: function (min,max) {
        return parseInt(Math.random() * (max - min + 1) + min);
    }
};

