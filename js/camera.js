
function processVid() {
    window.requestAnimationFrame(processVid);
    let now = performance.now();
    elapsed2 = now - lastDrawTime2;
    if (elapsed2 > fpsInterval2) {
        // Get ready for next frame by setting lastDrawTime=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        lastDrawTime2 = now - (elapsed2 % fpsInterval2);

        // draw
        predict();
    }
}

async function predict() {
    let predictions = await model.estimateSinglePose(video, {
                                flipHorizontal: false
                            });
    let cutPredictions = await cutPredict(predictions);
    // console.log(cutPredictions);
    if (cutPredictions != null) {
        let result = await knnClf.predictClass(cutPredictions);
        FSM.state = result.label;
        jsStatus.innerHTML = `prediction: ${classesChinese[result.label]}`;
        jsPredicStatus.innerHTML = `prediction: ${classes[result.label]}, 
                                    probability: ${result.confidences[result.label]}`;
    } else {
        FSM.state = 0;
        jsStatus.innerHTML = `prediction: ${classesChinese[0]}`;
        jsPredicStatus.innerHTML = `prediction: ${classes[0]}`;
    }
}

async function cutPredict(result) {

    if ( (result.keypoints[5].score > 0.6 && result.keypoints[6].score > 0.6) &&
         ((result.keypoints[7].score > 0.6 && result.keypoints[9].score > 0.6) || 
          (result.keypoints[8].score > 0.6 && result.keypoints[10].score > 0.6))
       ) {

        let cutPose = await tf.tensor2d([[result.keypoints[5].position.x, result.keypoints[5].position.y],
            [result.keypoints[6].position.x, result.keypoints[6].position.y],
            [result.keypoints[7].position.x, result.keypoints[7].position.y],
            [result.keypoints[8].position.x, result.keypoints[8].position.y],
            [result.keypoints[9].position.x, result.keypoints[9].position.y],
            [result.keypoints[10].position.x, result.keypoints[10].position.y],
            ]);
        return cutPose;
    }
}
