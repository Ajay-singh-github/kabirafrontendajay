import axios from "axios";
// var serverURL = "https://kb-aps2.onrender.com";
// var serverURL = "https://kabirabackend.onrender.com";
// var serverURL = "http://localhost:3000";
// var serverURL = "https://kabirabackend-1.onrender.com"
var serverURL = "http://43.204.98.81/api"
const getData = async (url) => {
  try {

    //
    let headers = {};
    if (localStorage.getItem("TOKEN")) {
      console.log("YESSSSSSSSSSSSSSSSSSSSSSS:",localStorage.getItem("TOKEN"))

      headers = { headers: { Authorization: `Bearer ${localStorage.getItem("TOKEN")}` } };
    }
    //

    var response = await axios.get(`${serverURL}/${url}`,headers);
    const result = await response.data;

    return result;
  } catch (e) {
    console.log("ereeeeeeeeeeeeeeeeeeeeeee:",e)

     if(e.response.status == 401)
     {
       localStorage.clear();
      //  window.location.replace("/login");
     }

     
    // // --------------------------------------------//
  }
};

const postData = async (url, body) => {
  try {

    let headers = {};
    if (localStorage.getItem("TOKEN")) {
      console.log("TOEKND AAAAAA:",localStorage.getItem("TOKEN"))
      
      headers = { headers: { Authorization: `Bearer ${localStorage.getItem("TOKEN")}` } };
    }
    
    
    var response = await axios.post(`${serverURL}/${url}`, body,headers);
    var result = response.data;

    return result;
  } catch (e) {
    console.log("ereeeeeeeeeeeeeeeeeeeeeee:",e.response.data)

    if(e.response.status == 401)
    {
      localStorage.clear();
    }

    return  e.response?.data || e.message;
    
    
    // --------------------------------------------//
  }
};


const putData = async (url, body) => {
    try {
        let headers = {};
        if (localStorage.getItem("TOKEN")) {
          headers = { headers: { Authorization: `Bearer ${localStorage.getItem("TOKEN")}` } };
        }

        var response = await axios.put(`${serverURL}/${url}`, body, { headers });
        var result = response.data;

        return result;
    } catch (e) {
        console.log("Error:", e.response?.data || e.message);

        // Handle 401 Unauthorized error
        if (e.response?.status === 401) {
            localStorage.clear();
            // window.location.replace("/login");
        }

        return e.response?.data || e.message;
    }
};



const deleteData = async (url, body) => {
    try {
  
      //
     // alert(localStorage.getItem("TOKEN"))
      let headers = {};
      if (localStorage.getItem("TOKEN")) {
        // headers = { headers: { Authorization: localStorage.getItem("TOKEN") } };
        headers = { headers: { Authorization: `Bearer ${localStorage.getItem("TOKEN")}` } };

      }
      //
      
    //   var response = await axios.delete(`${serverURL}/${url}`, body,headers);
    //   var result = await response.data;

    var response = await axios.request({
        method: "delete",
        url: `${serverURL}/${url}`,
        data: body,
        headers: headers.headers,
        
      });

      var result = await response.data;
      
  
      return result;
    } catch (e) {
      console.log("ereeeeeeeeeeeeeeeeeeeeeee:",e)
  
      // jab token expire ho jayega tab ye call hoga. //
      if(e.response && e.response.status == 401)
      {
      //   localStorage.clear();
      //   window.location.replace("/admin_login");
      }
      // --------------------------------------------//
    }
  };
  
export { serverURL, getData, postData,putData,deleteData };
