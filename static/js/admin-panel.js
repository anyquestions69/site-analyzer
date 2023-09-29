

$('#addForm').on('submit', async (e)=>{
    e.preventDefault()
    var arrPoints = new Array();
    $('.inputAddress').each(function(){
        arrPoints.push({place:$(this).val()});
    })
    console.log(arrPoints)
    let order = {
        trackId:$('#trackId').val(),
        sender:{
            name:$('#senderName').val(),
            place:$('#senderAddress').val()
        },
        receiver:{
            name:$('#receiverName').val(),
            place:$('#receiverAddress').val(),
            email:$('#receiverEmail').val()
        },
       points:arrPoints
    }
    console.log(JSON.stringify(order))
    let response = await fetch('/api/orders/',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body:JSON.stringify(order)
    })
    if(response.ok){    
        let res = await response.json()
        console.log(res)
        $('#trackId').val('')
        $('#receiverName').val('')
        $('#senderName').val(''),
        $('#senderAddress').val('')
        $('#receiverAddress').val(''),
        $('#receiverEmail').val('')
        let count =  $('.points').last().data('point')
        $('.points').not(':first').remove()
        $('.pointLabel').not(':first').remove()
    }
})

$('#addPoint').on('click', async (e)=>{
   let count =  $('.points').last().data('point')
   $('#pointsList').append(`
   <label for="inputAddress" class="form-label pointLabel">Пункт ${count+1}</label>
   <div class="col-12 points" data-point="${count+1}"> <input type="text" class="form-control inputAddress" placeholder="Название промежуточного пункта">
   </div> 
   `)

})