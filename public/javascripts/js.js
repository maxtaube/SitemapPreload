const submitButton = document.getElementById("submit");
const MAXIFRAMES = Number(20);

//make api request on submit
$(document).ready(function () {
  var input = document.getElementById("input");

  submitButton.addEventListener("click", function (event) {
    var inputValue = String(input.value);
    event.preventDefault();

    var formdata = new FormData();
    let sendurl = inputValue.startsWith("https://")
      ? inputValue
      : "https://" + inputValue;
    formdata.append("url", sendurl);
    $(document)
      .ajaxStart(function () {
        console.log("ajax start");
        var div = document.createElement("div");
        div.id = "loading";
        div.innerHTML = "Loading...";
        document.body.appendChild(div);
      })
      .ajaxStop(function () {
        console.log("ajax stop");
        document.getElementById("loading").remove();
      });

    $.ajax({
      // Request
      url: "/url",
      data: formdata,
      cache: false,
      contentType: false,
      processData: false,
      method: "POST",
      type: "POST", // For jQuery < 1.9
      success: function (data) {
        console.log(data.length, data);
        manageIframes(data)
      },
    });
  });
});

/**
 *
 * @param {array} data
 */
let manageIframes = (data) => {
  console.log("remaining data entries : ", data.length);
  var next = $('#next');

   // if iframes exist
  $("#framesContainer").empty();

  if (data.length > MAXIFRAMES) {
    var data1 = data.slice(0, MAXIFRAMES); // array with length of MAXIFRAMES
    var data2 = data.slice(MAXIFRAMES); // array with the rest
    console.log(data1.length, data2.length);

    next.html(`Preload the next ${data2.length} pages`).show();

    displayIframes(data1);
    // create event listener for button
    next.on('click', () => {
      manageIframes(data2);
    });
  }
  else {
    displayIframes(data);
    next.hide();
  }
};

let displayIframes = (data) => {
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
  submitButton.innerHTML = "Submit New";
}
