$('#urlForm').on('submit', async (e)=>{
    e.preventDefault()
    $('#submitErrorMessage').addClass('d-none')
    let str = $('#urlInput').val()
    if(!filter(str)){
        $('#submitErrorMessage').removeClass('d-none')
        return false
    }
    
   startParse(str)
})

$('#tableForm').on('submit', async (e)=>{
    e.preventDefault()
    $('#submitErrorMessage').addClass('d-none')
    let str = $('#urlInput').val()
    if(!filter(str)){
        $('#submitErrorMessage').removeClass('d-none')
        return false
    }
    
   startParse(str)
})

 function filter(str){
    var regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)
    return str.match(regex)
}

async function startParse(url){
   
  let response = await fetch('/api/sites/info',{
    method: 'POST',
    body:JSON.stringify({url:url}),
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
    })
    $('#submitSuccessMessage').removeClass('d-none')
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#submitSuccessMessage").offset().top
    }, 2000);
    loading(url)
   let site = await response.json()
   console.log(site)
   if(response.ok){
    if(!(site.category && site.description && site.title)){
        
        let socket = new WebSocket("ws://localhost:5000/websocket/");
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
            console.log('[close] Соединение прервано');
          }
        };
      }else{
        update(site)
      }
  
  
    }else{
        console.log('error')
    }
  } 
  
  
  async function update(site){
    $('#domain').empty()
    $('#category').empty()
    $('#theme').empty()
    $('#stillNot').html(site.url)
    $('#domain').html(site.domain)
    $('#category').html(site.category)
    $('#theme').html(site.theme)
    console.log(site.competitors)
    $('#competitors').empty()
    $('#keyWords').empty()
    $('#pageTable').empty()
    for(let s of site.competitors){
      
      $('#competitors').append(`<tr class='clickable-row' data-href='${s.url}'><td></td><td>${s.title}</td><td>${s.url}</td><td>${s.category}</td><td>${s.theme}</td></tr>`)
    }
    for(let w of site.keywords){
    
        $('#keyWords').append(`<tr class='clickable-row' data-href=''><td></td><td>${s.word}</td><td>${s.frequency}</td></tr>`)
    }
    for(let p of site.pages){
    
        $('#pageTable').append(`<tr class='clickable-row' data-href=''><td></td><td>${p.name}</td><td>${p.url}</td></tr>`)
    }
  }
  async function loading(url){
    $('#url').html(url)
    $('#domain').html('Загрузка...')
    $('#category').html('Загрузка...')
    $('#theme').html('Загрузка...')
    $('#competitors').empty()
      $('#competitors').append('Загрузка...')
    
   
        $('#keyWords').append('Загрузка...')
    
    
        $('#pageTable').append('Загрузка...')
    
  }