$('#urlForm').on('submit', async (e)=>{
    e.preventDefault()
    $('#submitErrorMessage').addClass('d-none')
    let str = $('#urlInput').val()
    if(!filter(str)){
        $('#submitErrorMessage').removeClass('d-none')
        $('#errorMsg').text('Введите корректный URL')
        return false
    }
    
   startParse(str)
})

$('#tableForm').on('submit', async (e)=>{
    e.preventDefault()
    $('#submitErrorMessage').addClass('d-none')
    parseTable()
})

 function filter(str){
    var regex = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g)
    return str.match(regex)
}
async function parseTable(){
  var form = new FormData(); 
  form.append("table", $("#tableInput")[0].files[0]);
  let response = await fetch('/api/upload',{
    method: 'POST',
    body:form
    })
    let sites = await response.json()
    console.log(sites)
    updateTable(sites.knownSites)
    loadingTable()
    if(sites.unknownSites.length!=0){
      let socket = new WebSocket("ws://localhost:5000/websocket/");
        socket.onopen = function(e) {
          socket.send(JSON.stringify(sites.unknownSites));
        };
        socket.onmessage = function(event) {
          let resSite = JSON.parse(event.data)
          updateTable(resSite)
          fetch('/api/sites/addmany',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body:JSON.stringify({unknownSites:resSite})
            }).then(upd=>upd.json()).then(jsRes=>{console.log(jsRes)})
           
        };
        socket.onclose = function(event) {
          if (event.wasClean) {
            console.log(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
          } else {
            console.log('[close] Соединение прервано');
          }
        };
    }
}
async function startParse(url){
   
  let response = await fetch('/api/sites/info',{
    method: 'POST',
    body:JSON.stringify({url:url}),
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
    })
   
    loading(url)
   let site = await response.json()
   if(response.ok){
    $('#submitSuccessMessage').removeClass('d-none')
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#submitSuccessMessage").offset().top
    }, 2000);
    if(!('category' in site && 'description' in site && 'title' in site && 'keywords' in site)){
        
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
            }).then(upd=>upd.json()).then(jsRes=>{console.log(jsRes)})
           
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
      $('#submitErrorMessage').removeClass('d-none')
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
  
  $('#competitors').empty()
  $('#keyWords').empty()
  $('#pageTable').empty()
  let response = await fetch('/api/sites/'+site.theme,{
    method: 'POST',
    body:JSON.stringify({url:url}),
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
    })
    if(response.ok){
      let result = await response.json()
      site.competitors=result
      for(let s of site.competitors){
        
        $('#competitors').append(`<tr class='clickable-row' data-href='${s.url}'><td></td><td>${s.title}</td><td>${s.url}</td><td>${s.category}</td><td>${s.theme}</td></tr>`)
      }
    }
  for(let w of site.keywords){
  
      $('#keyWords').append(`<tr class='clickable-row' data-href=''><td></td><td>${w.word}</td><td>${w.frequency}</td></tr>`)
  }
  for(let p of site.pages){
  
      $('#pageTable').append(`<tr class='clickable-row' data-href=''><td></td><td>${p.name}</td><td>${p.url}</td></tr>`)
  }
}
  async function updateTable(sites){
    for(let site of sites){
      $('#submitTableMessage').append(``)
    for(let s of site.competitors){
      
      $('#competitors').append(`<tr class='clickable-row' data-href='${s.url}'><td></td><td>${s.title}</td><td>${s.url}</td><td>${s.category}</td><td>${s.theme}</td></tr>`)
    }
    for(let w of site.keywords){
    
        $('#keyWords').append(`<tr class='clickable-row' data-href=''><td></td><td>${w.word}</td><td>${w.frequency}</td></tr>`)
    }
    for(let p of site.pages){
    
        $('#pageTable').append(`<tr class='clickable-row' data-href=''><td></td><td>${p.name}</td><td>${p.url}</td></tr>`)
    }
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
  async function loadingTable(){
    $('#url').html()
    $('#domain').html('Загрузка...')
    $('#category').html('Загрузка...')
    $('#theme').html('Загрузка...')
    $('#competitors').empty()
      $('#competitors').append('Загрузка...')
    
   
        $('#keyWords').append('Загрузка...')
    
    
        $('#pageTable').append('Загрузка...')
    
  }