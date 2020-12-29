// var selectedValue;
// var JSONData;
// function fetchdatafunction(sv)
// {
//     console.log("I am inside Fetch");
//     console.log(sv);
//     var xhrRequest = new XMLHttpRequest();
//     xhrRequest.onload = function()
//     {
//         JSONData = xhrRequest.response;
//         localStorage.setItem("JSON-Data", JSONData);
//         console.log(xhrRequest.response);

//         function JSONDATAFETCHING()
//         {
//             return JSONData;
//         }

//     }
//     xhrRequest.open('get', ' https://corona-api.com/countries'+'/'+sv, true);

//     xhrRequest.send();
// }

// function fetchdropdown()
// {
//     selectedValue = document.getElementById("country").value;
//     // console.log(selectedValue);
//     $('#fetch-data').click(fetchdatafunction(selectedValue));
// }


// if("JSON-Data" in localStorage)
// {
//     alert("yes");
// }
// else
// {
//     alert("no");
// }
