// 這裡是用web-animations.min.js得以實現
function boxAnimation ( pos1, pos2 ) {
    var boxframes = [
        {
            top: (pos1 + 'px')
        },
        {
            top: (pos2 + 'px')
        }
    ]
    return boxframes;
}