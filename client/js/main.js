document.addEventListener('DOMContentLoaded', function() {
  var animationContainer = document.getElementById('lottie-container');

  var animation = lottie.loadAnimation({
    container: animationContainer,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'animation.json'
  });
});