const submitButton = document.getElementById("submit");
var MAXIFRAMES = Number(20);

$(document).ready(function () {
  // setup
  try {
    MAXIFRAMES = document.getElementById("numberinput").value;
  } catch (error) {
    console.log(error);
  }

  var input = document.getElementById("input");
  var checkbox = document.getElementById("checkbox");

  //make api request on submit
  submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    var inputValue = String(input.value);
    var checkboxValue = checkbox.checked;

    var formdata = new FormData();
    let sendurl = inputValue.startsWith("https://")
      ? inputValue
      : "https://" + inputValue;
    formdata.append("url", sendurl);
    formdata.append("iframe", checkboxValue);

    // loading
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
        submitButton.innerHTML = "Submit New";
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

        /** render the list of urls that we get from the server as iFrames */
        console.log(data);
        if (typeof data['success'] !== "undefined") {
          displayMessage(data["success"] + " pages preloaded");
        }
        else {
          manageIframes(data);
        }
      },
    });
  });
});

/**
 *
 * @param {array} data
 */
let manageIframes = (data) => {
  var next = $("#next");
  $("#framesContainer").empty();

  if (data.length > MAXIFRAMES) {
    var data1 = data.slice(0, MAXIFRAMES); // array with size of MAXIFRAMES
    var data2 = data.slice(MAXIFRAMES); // array with the rest of the elements
    var nextChunk = data2.length > MAXIFRAMES ? MAXIFRAMES : data2.length;
    /* console.log("now split into", data1.length, " and ", data2.length);
    console.log("next chunk is", nextChunk); */

    next.html(`Preload the next ${nextChunk} pages`).show();

    displayIframes(data1);
    console.log("remaining data entries : ", data2.length);

    // create event listener for button
    next.on("click", () => {
      manageIframes(data2);
    });
  } else {
    displayIframes(data);
    next.hide();
  }
};

/**
 *
 * @param {array} data
 */
let displayIframes = (data) => {
  data.forEach((element) => {
    // create iframe
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
};

let displayMessage = (message) => {
  $("#framesContainer").empty();
  $("#framesContainer").html(message);
};
