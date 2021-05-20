var promises =[];
$(document).ready(function () {
    
    populateActor();
    populateProducer();
    populateGenre();    
    let query=window.location.search;
    let urlParams=new URLSearchParams(query);
    let type = urlParams.get("type");
    
    if(type=="edit"){
        $("#heading").text("Edit Movie");
        let id=urlParams.get('id');
        $.ajax({
            type:"GET",
            url:"https://localhost:5001/movies/" + id,
            success: function(response){
                Promise.all(promises).then(function() {
                    $("#movie-name").val(response.name);
                    $("#yor").val(response.yearOfRelease);
                    $("#producer").val(response.producer.id).trigger("change");
                    var actorIds = []
                    response.actors.forEach((a) =>{
                        actorIds.push(a.id);
                    })
                    $("#actor").val(actorIds);
                    $("#actor").trigger("change")
                    var genreIds = []
                    response.genres.forEach((g) =>{
                        genreIds.push(g.id);
                    })
                    $("#genre").val(genreIds).trigger("change");
                    $("#plot").val(response.plot); 
                })
               
            }
        })     
        $("#movieForm").attr("onsubmit",`editMovie(${id})`)
    }
    else{
        $("#movieForm").attr("onsubmit","addMovie()")
    }
    })

function populateActor(){
    promises.push($.ajax({
        type: "GET", url: "https://localhost:5001/actors", success: function (response) {
            $.each(response, function (index, value) {
                $("#actor").append(`<option value= "${value.id}">${value.name}</option>`)
            })
        }
    }))
}

function populateProducer(){
    promises.push($.ajax({
        type: "GET", url: "https://localhost:5001/producers", success: function (response) {
            $("#producer").append(`<option value= "null">Choose one</option>`)
            $.each(response, function (index, value) {
                $("#producer").append(`<option value= "${value.id}">${value.name}</option>`)
            })
        }
    }))
}

function populateGenre(){
    promises.push($.ajax({
        type: "GET", url: "https://localhost:5001/genres", success: function (response) {
            $.each(response, function (index, value) {
                $("#genre").append(`<option value= "${value.id}">${value.name}</option>`)
            })
        }
    }))
}

function addMovie() {
    var formData = new FormData();
    var imageFile = $("#poster").prop("files");
    formData.append('poster', imageFile[0], imageFile[0].name);
    console.log(formData);
    $.ajax({
        type: 'POST',
        url: "https://localhost:5001/movies/upload",
        data: formData,
        processData: false,
        contentType: false,
        success: function (imageUrl) {
            console.log(imageUrl);
            let o = JSON.stringify(
                {
                    name: $("#movie-name").val(),
                    yearOfRelease: $("#yor").val(),
                    producerId: $("#producer").val(),
                    actorIds: $("#actor").val(),
                    genreIds: $("#genre").val(),
                    plot: $("#plot").val(),
                    poster: imageUrl
                });
            console.log(o);
            $.ajax({
                url: "https://localhost:5001/movies",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                data: o,
                success: function () {
                    window.alert("success");
                },
                error: function (error) {
                    window.alert("error");
                    console.log(error);
                }
            });
        },
        error: function (error) {
            console.log(error)
        }
    })
}

function editMovie(id){
    var formData = new FormData();
    var imageFile = $("#poster").prop("files");
    formData.append('poster', imageFile[0], imageFile[0].name);
    console.log(formData);
    $.ajax({
        type: 'POST',
        url: "https://localhost:5001/movies/upload",
        data: formData,
        processData: false,
        contentType: false,
        success: function (imageUrl) {

            console.log(imageUrl);
            let o = JSON.stringify(
                {
                    name: $("#movie-name").val(),
                    yearOfRelease: $("#yor").val() ,
                    producerId: $("#producer").val(),
                    actorIds: $("#actor").val(),
                    genreIds: $("#genre").val(),
                    plot: $("#plot").val(),
                    poster: imageUrl
                });
            console.log(o);
            $.ajax({
                url: "https://localhost:5001/movies/" + id,
                type: "PUT",
                contentType: "application/json; charset=utf-8",
                data: o,
                success: function () {
                    window.alert("success");
                },
                error: function (error) {
                    window.alert("error");
                    console.log(error);
                }
            });
        },
        error: function (error) {
            console.log(error)
        }
    })
}


$("#ActorForm").on("submit",addActor)

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
            $("#actorModalClose").trigger("click");
            $("#actor").empty();
            populateActor();    
        },
        error: function(e){
            console.error(e);
        }
    });
}

$("#addProducerForm").on("submit", addProducer)
function addProducer(){
    var actorObject = JSON.stringify({
        name: $("#producerName").val(),
        bio: $("#producerBio").val(),
        dob: $("#producerDob").val(),
        sex: $("input:radio[name=producerGender]:checked").val()
    });
    $.ajax({
        type:"POST",
        url:"https://localhost:5001/producers",
        contentType: "application/json; charset=utf-8",
        data: actorObject,
        success: function(response){
            $("#producerModalClose").trigger("click");
            $("#producer").empty();
            populateProducer(); 
        },
        error: function(e){
            console.error(e);
        }
    });
}

$("#addGenreForm").on("submit",  function(){
    let genreObject =JSON.stringify( {
        name: $("#genreName").val()       
    });
    $.ajax({
        type:"POST",
        url:"https://localhost:5001/genres",
        data: genreObject,
        contentType: "application/json; charset=utf-8",
        success: function(response){
            $("#genreModalClose").trigger("click");
            $("#genre").empty();
            populateGenre();
        },
        error: function(e){ 
            console.log(e);}
    });
})

