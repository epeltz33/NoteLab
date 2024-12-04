document.addEventListener('DOMContentLoaded', function() {
  var animationContainer = document.getElementById('lottie-container');
// define the animation
  var animation = lottie.loadAnimation({
    container: animationContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'animation.json'
  });
});