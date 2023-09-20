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
    let response = await fetch('/api/users',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
       })
       let text = await response.text()
       console.log(text)
       $('#ping').append(text)
}

async function getUser(){
  console.log()
  let response = await fetch('/api/users/'+window.location.href.split('/')[4],{
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