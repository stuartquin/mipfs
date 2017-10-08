var DOMAIN = "127.0.0.1";
var GATEWAY_PORT = "8080";
var API_PORT = "5001";
var ipfs = window.IpfsApi(DOMAIN, API_PORT);
var dropArea = document.getElementById("dropArea");
var resultsEl = document.getElementById("results");

var storeData = function(fileName, data) {
  var buffer = ipfs.Buffer.from(data);

  ipfs.add(buffer).then(function (res) {
    res.forEach(function (file) {
      if (file && file.hash) {
        var url = "http://" + DOMAIN + ":" + GATEWAY_PORT + "/ipfs/" + file.hash;
        var el = "<div class='result'>";
        el += "Uploaded " + fileName + " at ";
        el += "<a href='" + url + "'>";
        el += url;
        el += "</a>";
        el += "</div>";

        resultsEl.innerHTML += el;
      }
    });
  });
};

var loadFile = function(file) {
  var reader = new FileReader();
  reader.onloadend = function(res) {
    storeData(file.name, reader.result);
  };
  reader.readAsArrayBuffer(file);
};

var handleFiles = function(files) {
  [].forEach.call(files, loadFile);
};

var dragEnter = function(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  dropArea.classList.add("hover");
};

var dragExit = function(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  dropArea.classList.remove("hover");
};

var dragOver = function(evt) {
  evt.stopPropagation();
  evt.preventDefault();
};

var dropFiles = function(evt) {
  evt.stopPropagation();
  evt.preventDefault();

  var dataTransfer = evt.dataTransfer;
  handleFiles(dataTransfer.files);
};

var IV = new Uint8Array(12);

var encrypt = function(data, password) {
  var ptUtf8 = new TextEncoder().encode(data);
  var pwUtf8 = new TextEncoder().encode(password);
  var alg = {
    name: "AES-GCM",
    iv: IV
  };

  return crypto.subtle.digest("SHA-256", pwUtf8).then(function(pwHash) {
    return crypto.subtle.importKey("raw", pwHash, alg, false, ["encrypt"]);
  }).then(function(key) {
    return crypto.subtle.encrypt(alg, key, ptUtf8);
  });
};

var decrypt = function(data, password) {
  var pwUtf8 = new TextEncoder().encode(password);
  var alg = {
    name: "AES-GCM",
    iv: IV
  };
  console.log("ENCRYPTED", new TextDecoder().decode(data));

  return crypto.subtle.digest("SHA-256", pwUtf8).then(function(pwHash) {
    return crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt']);
  }).then(function(key) {
    return crypto.subtle.decrypt(alg, key, data);
  }).then(function(plainBuffer) {
    var plaintext = new TextDecoder().decode(plainBuffer);
    console.log("PLAIN", plaintext);
    console.log(plaintext);
  });
};

encrypt("Hello World", "").then(function(encrypted) {
  decrypt(encrypted, "");
});

dropArea.addEventListener("click", function (e) {
  document.getElementById("input").click();
  e.preventDefault();
}, false);
dropArea.addEventListener("dragenter", dragEnter, false);
dropArea.addEventListener("dragleave", dragExit, false);
dropArea.addEventListener("dragover", dragOver, false);
dropArea.addEventListener("drop", dropFiles, false);
