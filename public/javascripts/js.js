//make api request on submit
$(document).ready(function () {
  const submitButton = document.getElementById("submit");
  var input = document.getElementById("input");

  submitButton.addEventListener("click", function (event) {
    var inputValue = input.value;
    event.preventDefault();
    var responseText;

    var formdata = new FormData();
    formdata.append("url", "https://" + inputValue);
    $(document).ajaxStart(function () {
      console.log("ajax start");
      var div = document.createElement("div");
      div.id = "loading";
      div.innerHTML = "Loading...";
      document.body.appendChild(div);
    }).ajaxStop(function () {
      console.log("ajax stop");
      document.getElementById("loading").remove();
    }); 
    $.ajax({
      url: "/url",
      data: formdata,
      cache: false,
      contentType: false,
      processData: false,
      method: "POST",
      type: "POST", // For jQuery < 1.9
      success: function (data) {
        console.log(data);
        data.forEach((element) => {
          // create iframe
          console.log(element);
          var iframe = document.createElement("iframe");
          iframe.src = element;
          iframe.frameBorder = "0";
          var wrapper = document.createElement("div");
          var insideWrapper = document.createElement("div");
          insideWrapper.setAttribute("id", "insideWrapper");
          wrapper.setAttribute("id", "wrapper");
          insideWrapper.appendChild(iframe);
          wrapper.appendChild(insideWrapper);
          document.getElementById("framesContainer").appendChild(wrapper);
        });
      },
    });
  });
});
