const btn = document.querySelector('.btn');
const result = document.querySelector('.result');
let recognizer = '';
try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognizer = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  document.getElementById('no-browser-support').style.display = 'block';
  document.getElementById('micro').style.display = 'none';
}

recognizer.continuous = true;
recognizer.interimResults = true;
recognizer.maxAlternatives = 2;
recognizer.lang = 'en-US';

btn.addEventListener('click', () => {
  result.innerText = '';
  recognizer.start();

  recognizer.onaudiostart = e => {
    btn.classList.add('active');
    result.classList.add('active');
  };
});

recognizer.onerror = function(event) {
  result.innerText = 'Error occurred in recognition: ' + event.error;
}

var save = function(){
console.log(result.innerText+"save");
var email = window.localStorage.getItem('email');
var Ref = firebase.firestore()
.collection("users")
.doc(email);
Ref.get().then(doc => {
if (doc.exists) {
  Ref.update(
    {
      transcript: result.innerText,
    }
  ).then(function(){
    console.log("transcript added successfully")
    window.location.href = window.location.origin+'/page4';
  }
  );
}else{
  Ref.set(
    {
      email: email,
      transcript: result.innerText,
    }, {merge: true}
  ).then(function(){
    console.log("transcript added successfully")
    window.location.href = window.location.origin+'/page4';
  }
  );

}
});
}
document.getElementById('save').addEventListener(
  'click', save);

  recognizer.onresult = e => {
    const text = e.results[e.resultIndex];
  
  
    if (e.results[0].isFinal) {
      result.innerText = '';
      result.innerText = text[0].transcript;
      btn.classList.remove('active');
      result.classList.remove('active');
      recognizer.stop();
      document.getElementById('save').style.display = 'block';

    } else {
      result.innerText = text[0].transcript;
      document.getElementById('save').style.display = 'block';
    }
  
    console.log(text[0].transcript);
    if (text[0].transcript === 'can you help me') {
      alert("You're doing something wrong. Everything has an easy answer");
    }
  };