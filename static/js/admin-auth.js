$(document).ready(async ()=>{
    let role = await fetch('/api/users/checkRole', {method:'PUT'})
    if( role.ok){
        let rtext= await role.text()
    
        if(rtext=='admin'){

        }else if(rtext=='manager'){
            $('.admin-only').remove()
            $('#adminName').text('Менеджер')
        }else{
            window.location.href='/'
        }
    }else{
        window.location.href='/login'
    }
})