jQuery(document).ready(function($) {
  $(".clickable-row").click(function() {
      window.location = $(this).data("href");
  });
});

async function auth(){
    let response = await fetch('/api/users/self',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  })
  let text = await response.text()
  if(response.ok){
    $('#usernameTop').html(text)
  
  }else{
    alert(text)
    window.location.href ="/login.html"
  }
 
}

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
     let response = await fetch('/api/site/',{
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
  let socket = new WebSocket("ws://localhost/ws");

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
/*  var socket = io('/ws'); 
    socket.emit("url", {url:user.url});
    $('#load').modal('show');
    $('#exampleModal').modal('hide');
   
 socket.on('siteRes',async (data)=>{
        $('#load').modal('hide');
        let res = JSON.parse(data)
        let response = await fetch('/api/site/',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(res)
         })
         let result = await response.text()
         console.log(result)
    } )
*/

  }
} 

async function getUsersTable(){
  let response = await fetch('/api/users',{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
   })
   let {users }= await response.json()

   for (let user of users){
    console.log(user)
    $('#userTable').append(`<tr>
    <td>${user.firstname}</td>
    <td>${user.lastname}</td>
    <td>${user.email}</td>
    <td>${user.password}</td>
    <th>Delete</th>

  </tr>`)
   }
  
  
}