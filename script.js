// document.addEventListener('DOMContentLoaded', function() {
//     const popupLink = document.getElementById("popup-link");
//     const popupWindow = document.getElementById("popup");
//     const closeButton = document.getElementById("close-button");
  
//     popupLink.addEventListener("click", function(event) {
//       event.preventDefault();
//       popupWindow.style.display = "block";
//     });
  
//     closeButton.addEventListener("click", function() {
//       popupWindow.style.display = "none";
//     });
// });

window.addEventListener("load", function(){
    setTimeout(
        function open(event){
            document.querySelector(".popup").style.display = "block";
        },
        1000
    )
});


document.querySelector("#close").addEventListener("click", function(){
    document.querySelector(".popup").style.display = "none";
});
  