const getData = async (query) => {
    const response = $.ajax({
        url: query,
        method: "GET",
        dataType: 'json'
    });

    return response;
};

$(document).ready(async function() {
    /** With Key */
    $("#search-input").keyup(async function(e) {
        if (e.keyCode == 13) {
            $(".get-by-search").click();
        }
    });

    /** Pencarian */
    $(".get-by-search").on("click", async function () {
        $("#anime-list").html(`
        <div class="row mb-3 justify-content-center">
            <div class="text-center mx-auto">
                <b>Please Wait!!!</b>
                <br>
                <img src="http://komikato.bugs.today/assets/image/menhera.gif" class="rounded">
            </div>  
        </div>
    `);

        const query = $("#search-input").val();
        const getBySearch = await getData(`http://komikato.bugs.today/otakudesu/api/search/${query.replace(" " || "%20")}`);
        if (!getBySearch.success) return;

        const dataSearch = getBySearch.data;
        if (dataSearch.length < 1) return $("#anime-list").html(`
        <div class="row justify-content-center">
            <div class="text-center">
                <b>Anime tidak ditemukan!</b>
                <br>
                <img src="https://cdn.discordapp.com/emojis/746208811848695849.png" class="rounded">
            </div>  
        </div>
        `)

        $(".main-title").text("Hasil Pencarian");
        document.title = "Hasil Pencarian: " + query;

        $("#anime-list").html('');
        dataSearch.forEach((a, i) => {
            $("#anime-list").append(`
            <div class="col-md-3">
                <div class="card mb-3" style="width: auto;">
                    <img src="${a.thumb}" class="card-img-top" alt="">
                    <div class="card-body">
                        <h5 class="card-title text-center">${a.name}</h5>
                        <a class="btn btn-dark btn-sm btn-block see-detail" href="#" data-toggle="modal" data-source="otakudesu" data-endpoint="${a.endpoint.replace('https://otakudesu.vip/anime/', '')}" data-target="#exampleModal">Detail</a>
                    </div>
                </div>
            </div>
            `);
        });
        
    });

    /** Home Anime List */
    const getAnimeList = await getData("http://komikato.bugs.today/otakudesu/api/home");
    if (!getAnimeList.success) return;

    const animeList = getAnimeList.data.ongoing;
    animeList.forEach((a, i) => {
        $("#anime-list").append(`
        <div class="col-md-3">
            <div class="card mb-3" style="width: auto;">
                <img src="${a.thumb}" class="card-img-top" alt="">
                <div class="card-body">
                    <h5 class="card-title text-center">${a.name}</h5>
                    <a class="btn btn-dark btn-sm btn-block see-detail" href="#" data-toggle="modal" data-source="otakudesu" data-endpoint="${a.endpoint.replace('https://otakudesu.vip/anime/', '')}" data-target="#exampleModal">Detail</a>
                </div>
            </div>
        </div>
        `);
    });

    /** Anime Details */
    $("#anime-list").on("click", ".see-detail", async function() {
        $('.modal-title').text('');
        $('.modal-body').html(`
            <div class="text-center">
                <b>Please Wait!!!</b>
                <br>
                <img src="http://komikato.bugs.today/assets/image/menhera.gif" class="rounded">
            </div>  
        `);


        const endpoint = $(this).data('endpoint');
        const getDetail = await getData(`http://komikato.bugs.today/otakudesu/api/anime/detail/${endpoint}`);
        const detail = getDetail.data;

        $('.modal-title').text(`${detail.title}`);
        $('.modal-body').html(`
                <div class="container-fluid">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${detail.thumb}" class="img-fluid" alt="...">
                        </div>

                        <div class="col-md-8">
                            <ul class="list-group">
                                <li class="list-group-item"><b>Japanese:</b> ${detail.japanese}</li>
                                <li class="list-group-item"><b>Skor:</b> ⭐${detail.skor}</li>
                                <li class="list-group-item"><b>Producer:</b> ${detail.producer}</li>
                                <li class="list-group-item"><b>Type:</b> ${detail.type}</li>
                                <li class="list-group-item"><b>Genre:</b> ${detail.genre}</li>
                                <li class="list-group-item"><b>Status:</b> ${detail.status}</li>
                                <li class="list-group-item"><b>Episodes:</b> ${detail.episodes}</li>
                            </ul>
                        </div>
                    </div>
                    <hr>
                    <div class="row">
                        <div class="col-sm-12">
                            <p>${detail.sinopsis.join('\n')}</p>
                        </div>
                    </div>
                    <hr>
                </div>
            `);
    });
});