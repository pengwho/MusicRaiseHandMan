// https://www.366service.com/zh-tw/qa/914b43f8876392938ea9877b380305d0
// https://jsfiddle.net/n51b9qch/1/
// 有限狀態機 finite-state machine (FSM)
const FSM = {
    lastState: 0,
    FSMListener: function (val) {
        boxOnBeats(val);
    },
    set state(val) {
        if ( this.lastState != val ) {
            // 由 0 -> 1 or 2
            if ( this.lastState == 0 ) {
                this.lastState = val;
                this.FSMListener(val);
            }
            // 由 1 or 2 -> 0
            else if ( val == 0 ) {
                this.lastState = val;
            }
        }
    },
    get state() {
        return this.lastState;
    },
}