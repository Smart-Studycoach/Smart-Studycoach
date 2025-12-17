// Betere naam vor deze file bedenken.

// Import the built-in HTTP module
const http = require("http");

function makeGetRequest() {
  const options = {
    hostname: "jsonplaceholder.typicode.com", // Example public API
    path: "/posts/1",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 5000, // 5 seconds timeout
  };

  const req = http.request(options, (res) => {
    let data = "";

    // Handle incoming data chunks
    res.on("data", (chunk) => {
      data += chunk;
    });

    // End of response
    res.on("end", () => {
      console.log("GET Response:", data);
    });
  });

  // Handle request errors
  req.on("error", (err) => {
    console.error("GET Request Error:", err.message);
  });

  // Handle timeout
  req.on("timeout", () => {
    console.error("GET Request Timed Out");
    req.destroy();
  });

  req.end(); // Send the request
}

// ----------------------
// HTTP POST Request
// ----------------------
function makePostRequest() {
  const postData = JSON.stringify({
    title: "foo",
    body: "bar",
    userId: 1,
  });

  const options = {
    hostname: "jsonplaceholder.typicode.com",
    path: "/posts",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
    timeout: 5000,
  };

  const req = http.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      console.log("POST Response:", data);
    });
  });

  req.on("error", (err) => {
    console.error("POST Request Error:", err.message);
  });

  req.on("timeout", () => {
    console.error("POST Request Timed Out");
    req.destroy();
  });

  // Write data to request body
  req.write(postData);
  req.end();
}

// Run both requests
makeGetRequest();
makePostRequest();
