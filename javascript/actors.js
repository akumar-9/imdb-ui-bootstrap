$(document).ready(getActors());

function getActors(){
    $.ajax({type:"GET", url:"https://localhost:5001/actors", success: function(response){
       $.each(response,function(index, value){
           $("section").append(`<div class="card" id="${value.id}" style="width: 18rem;">
           <div class="card-body">
               <h2 class="card-title" id="name${value.id}">${value.name}</h2>
               <h6 class="card-subtitle mb-2 text-muted" id="dob${value.id}">${value.dob.substring(0, 10)}</h6>
               <small class="card-subtitle  text-muted" id="sex${value.id}">${value.sex}</small>
               <p class="card-text mt-2" id="bio${value.id}">${value.bio}</p>
           </div>
           <div class="card-footer">
               <button class="btn btn-secondary" onclick=showActor(${value.id}) data-bs-toggle="modal" data-bs-target="#actorEditModal">
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                   <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"></path>
                 </svg>
               </button>
               <button class="btn btn-secondary" onclick=deleteActor(${value.id})>
                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                       <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                       <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                   </svg>
               </button>
           </div>
       </div>`)
       })
    }})
};

$("#addActorForm").on("submit",addActor)
function addActor(){
    var actorObject = JSON.stringify({
        name: $("#actorName").val(),
        bio: $("#actorBio").val(),
        dob: $("#actorDob").val(),
        sex: $("input:radio[name=actorGender]:checked").val()
    });
    $.ajax({
        type:"POST",
        url:"https://localhost:5001/actors",
        contentType: "application/json; charset=utf-8",
        data: actorObject,
        success: function(response){
            $("#addModalClose").trigger("click"); 
            $("section").empty(); 
            getActors();       
        },
        error: function(e){
            console.error(e);
        }
    });
}

function editActor(id){
    let actorObject =JSON.stringify( {
        name: $("#actorNewName").val(),
        dob: $("#actorNewDob").val(),
        bio: $("#actorNewBio").val(),
        sex: $("input:radio[name=actorNewGender]:checked").val()
    });
    $.ajax({
        type:"PUT",
        url:"https://localhost:5001/actors/" + id,
        data: actorObject ,
        contentType: "application/json; charset=utf-8",
        success: function(){
           console.log("success");
           $("#editModalClose").trigger("click");
           $("section").empty();
           getActors();    
        },
        error: function(e){
            console.log(e);
        }
    })
}


function showActor(id){
    $("#actorNewName").val($(`#name${id}`).text());
    $("#actorNewDob").val($(`#dob${id}`).text());
    $("#actorNewBio").val($(`#bio${id}`).text());
    var sex = $(`#sex${id}`).text()
    $(`#${sex}`).prop("checked",true);
    $("#editActorForm").attr("onsubmit",`editActor(${id})`);
}



function deleteActor(id){    
    $.ajax({
        type:"DELETE",
        url:"https://localhost:5001/actors/" + id,
        success: function(){
            $(`#${id}`).remove();
        },
        error: function(e){
            console.log(e);
        }
    })
}