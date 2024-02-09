document.addEventListener('load', function() {
    const popupWindow = document.getElementById("popup");
    const closeButton = document.getElementById("close-button");
  
    popupWindow.style.display = 'block';
    
      
    // doc.addEventListener('load', function(event) {
    //   event.preventDefault();
    //   popupWindow.style.display = "block";
    // });
  
    closeButton.addEventListener("click", function() {
      popupWindow.style.display = "none";
    });
});

// window.addEventListener("load", function(){
//     setTimeout(
//         function open(event){
//             document.getElementById("#popup").style.display = "block";
//         },
//         1000
//     )
// });


// document.getElementById("#close").addEventListener("click", function(){
//     document.querySelector("#popup").style.display = "none";
// });
  