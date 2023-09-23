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
        
        return text
       
      }
      console.log(text)
          $('#feedback').empty().append(`<p>${text}</p>`)

          return text
         
     
}

async function ping(){
    let response = await fetch('/api/sites/all',{
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
  window.location.href ="/blank.html"


  }
} 


async function receiveResults(){
  let response = await fetch('/api/sites/info',{
  method: 'GET',
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
  })
  let site = await response.json()
  if(response.ok){
    if(!(site.category && site.description && site.title)){
      
      let socket = new WebSocket("ws://localhost/websocket/");
      socket.onopen = function(e) {
        socket.send(JSON.stringify({url:site.url}));
      };

      socket.onmessage = function(event) {
        
        let resSite = JSON.parse(event.data)
        update(resSite)
        fetch('/api/sites/',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          },
          body:event.data
          })
         
      };

      socket.onclose = function(event) {
        if (event.wasClean) {
          console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
        } else {
          // например, сервер убил процесс или сеть недоступна
          // обычно в этом случае event.code 1006
          console.log('[close] Соединение прервано');
        }
      };
    }else{
      update(site)
    }


  }else{
    window.location.href ="/login.html"
  }
  
}
async function update(site){
  $('#url').html(site.url)
  $('#category').html(site.category)
  console.log(site.competitors)
  for(let s of site.competitors){
    $('#competitors').empty()
    $('#competitors').append(`<tr class='clickable-row' data-href='${s.url}'><td>${s.title}</td><td>${s.url}</td><td>${s.description}</td></tr>`)
  }
}