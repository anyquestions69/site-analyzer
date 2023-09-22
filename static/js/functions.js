jQuery(document).ready(function($) {
  $(".clickable-row").click(function() {
      window.location = $(this).data("href");
  });
});



async function register(){
    const user = {
        email:$('#email').val(),
        password:$('#password').val(),
        first_name:$('#firstname').val(),
        last_name:$('#lastname').val(),
        repass : $('#repass').val(),
      }
     let response = await fetch('/api/auth/register',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(user)
     })
      let text = await response.text()
      if(response.ok){
        document.cookie="user="+text
        window.location.href ="/index.html"
      }
      console.log(text)
          $('#feedback').empty().append(`<p>${text}</p>`)
         return text
}

async function search(){
    const user = {
        url:$('#url').val(),
    }
     let response = await fetch('http://app:3000/sites/',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify(user)
     })
      let text = await response.text()
      if(response.ok){
       
        //document.cookie="user="+text
        window.location.href ="/blank.html"
        return text
       
      }
      console.log(text)
          $('#feedback').empty().append(`<p>${text}</p>`)

          return text
         
     
}

async function ping(){
    let response = await fetch('/api/sites',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
       })
       let text = await response.text()
       console.log(text)
       $('#ping').append(text)
}

async function startParse(){
  const user = {
    url:$('#url').val(),
}
 let response = await fetch('/api/sites/add',{
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  body: JSON.stringify(user)
 })
 let text = await response.text()
 console.log(text)
 if(response.ok){
  let socket = new WebSocket("ws://broker:8000");

socket.onopen = function(e) {
  alert("[open] Соединение установлено");
  alert("Отправляем данные на сервер");
  socket.send(JSON.stringify(user));
};

socket.onmessage = function(event) {
  alert(`[message] Данные получены с сервера: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
  } else {
    // например, сервер убил процесс или сеть недоступна
    // обычно в этом случае event.code 1006
    alert('[close] Соединение прервано');
  }
};


  }
} 


