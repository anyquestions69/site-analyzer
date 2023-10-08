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
    
    let data
    if('Лист1' in sites){
        data =sites['Лист1'].slice(20,30)
    }else if('List1' in sites){
      data =sites['List1'].slice(20,30)
    }else{
      data=[]
    }
   
    let result = await fetch('/api/sites/getmany',{
      method: 'POST',
      body:JSON.stringify({sites:data}),
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
      })
    let res = await result.json()
    console.log(res)
    $('#submitTableMessage').removeClass('d-none')
    $([document.documentElement, document.body]).animate({
      scrollTop: $("#submitTableMessage").offset().top
  }, 2000);
    if(res.knownSites.length!=0){
      updateTable(res.knownSites)
    }
    loadingTable(res.knownSites.length, res.unknownSites.length)
    if(res.unknownSites.length!=0){
      let socket = new WebSocket("ws://localhost:5000/websocket/");
        socket.onopen = function(e) {
          socket.send(JSON.stringify(res.unknownSites));
        };
        socket.onmessage = function(event) {
          let resSite = JSON.parse(event.data)
          console.log(resSite)
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
    if(!('category' in site  && 'title' in site && 'keywords' in site)){
        
        let socket = new WebSocket("ws://localhost:5000/websocket/");
        socket.onopen = function(e) {
          socket.send(JSON.stringify({url:site.url}));
        };
  
        socket.onmessage = function(event) {
          
          let resSite = JSON.parse(event.data)
          console.log(resSite.url)
          update(resSite)
          fetch('/api/sites/',{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body:event.data
            }).then(upd=>upd.json())
           
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
  $('#siteName').html(site.title)
  $('#domain').html(site.domain)
  $('#category').html('Спорт')//site.category)
  $('#theme').html('Спорт')//site.theme)
  
  $('#routeTable').empty()
  $('#keyWords').empty()
  $('#pageTable').empty()
  let response = await fetch('/api/sites/theme/'+site.theme,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
    })
    if(response.ok){
      let result = await response.json()
      console.log(result)
      $('#routeTable').empty()
      for(let s of result.competitors){
        if(s.url==site.url)
          continue
        $('#routeTable').append(`<tr class='clickable-row' data-href='${s.url}'><td>${s.title}</td><td>${s.url}</td><td>${s.category}</td><td>${s.theme}</td></tr>`)
      }
    }
  for(let w of site.keywords){
  
      $('#keyWords').append(`<tr class='clickable-row' data-href=''><td>${w.word}</td><td>${w.frequency}%</td></tr>`)
  }
  for(let p of site.pages){
  
      $('#pageTable').append(`<tr class='clickable-row' data-href=''><td>${p.name}</td><td>${p.url}</td></tr>`)
  }
}
  async function updateTable(sites){
    $('#loadingBar').remove()
    sites.forEach((s,i) => {
      
      $('#submitTableMessage').append(`
          <div class="container-${i} px-5 " data-id="${i}">
          <h3 class="bold"><mark class="siteTitle">${i+1}. ${s.url} </mark></h3>
          <div class="d-flex justify-content-between mb-3 border-bottom">
              <div class="col-lg-2  text-start" >
                  <div class="testimonial-item mx-auto mb-5 mb-lg-0" style="overflow: scroll;">
                      <h5 class="bold"><b>Основная информация</b></h5><br>
                      <p class="font-weight-light">Домен: <span data-attr="domain">${s.domain}</span></p>
                      <p class="font-weight-light">Название: <span data-attr="siteName">${s.title}</span></p>
                      <p class="font-weight-light">Тема: <span data-attr="theme">Спорт</span></p>
                      <p class="font-weight-light">Категория: <span data-attr="category">Спорт</span></p>
                  </div>
              </div>
              <div class="col-lg-5 ">
                  <div class="testimonial-item mx-auto mb-5 mb-lg-0" style="overflow: scroll;">
                      
                      <h5>Страницы</h5>
                      <table class="table table-hover text-bg-white">
                     
                          <thead>
                          <tr>
                              <th scope="col">Название</th>
                              <th scope="col">URL</th>
                          </tr>
                          </thead>
                          <tbody class="pageTable">
                          
                        
                          </tbody>
                      </table>
                  </div>
              </div>
              <div class="col-lg-4">
                  <div class="testimonial-item mx-auto mb-5 mb-lg-0" style="overflow: scroll;">
                      
                      <h5>Ключевые слова</h5>
                      <table class="table table-hover text-bg-white">
                          <thead>
                          <tr>
                              <th scope="col">Слово</th>
                              <th scope="col">Частота</th>
                          </tr>
                          </thead>
                          <tbody class="keyWords">
                         
                        
                          </tbody>
                      </table>
                  </div>
              </div>
              
          </div>
      </div>
      `)
      s.pages.forEach(p=>{$('.pageTable').eq(i).append(`<tr><td scope="col">${p.name}</td><td >${p.url}</td></tr>`)})
    /* for(let c of s.competitors){
      
      $('#competitors').append(`<tr class='clickable-row' data-href='${c.url}'><td></td><td>${c.title}</td><td>${c.url}</td><td>${c.category}</td><td>${c.theme}</td></tr>`)
    } */
    for(let w of s.keywords){
      $('.keyWords').eq(i).append(`<tr class='clickable-row' data-href=''><td>${w.word}</td><td>${w.frequency}</td></tr>`)
        
    }
    
  });
  }
  async function loading(url){
    $('#url').html(url)
    $('#domain').html('Загрузка... <img width="20px" src="../assets/ZKZg.gif">')
    $('#category').html('Загрузка... <img width="20px" src="../assets/ZKZg.gif">')
    $('#theme').html('Загрузка... <img width="20px" src="../assets/ZKZg.gif">')
    $('#siteName').html('Загрузка... <img width="20px" src="../assets/ZKZg.gif">')
    $('#competitors').empty()
      $('#competitors').append('Загрузка... <img width="20px" src="../assets/ZKZg.gif">')
    
   
        $('#keyWords').append('Загрузка... <img width="20px" src="../assets/ZKZg.gif">')
    
    
        $('#pageTable').append('Загрузка... <img width="20px" src="../assets/ZKZg.gif">')
    
  }
  async function loadingTable(known, unknown){
    let sites = known+unknown
    $('#submitTableMessage').append(`<div class="container loading text-center d-flex justify-content-center align-items-center" id="loadingBar"><h2>Загружено ${known} из ${sites}\t</h2><img class='ms-3' width="30px" src="../assets/ZKZg.gif"></div`)
    
  }