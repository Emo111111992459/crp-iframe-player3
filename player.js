window.addEventListener("message", function(e) {

		console.log(e);

		var video_config_media = JSON.parse(e.data.video_config_media);
		var user_lang = e.data.lang;
		var video_stream_url = "";
		var video_id = video_config_media['metadata']['id'];
		var rows_number = 0;
		var video_m3u8_array = [];

	    for(var i = 0; i < video_config_media['streams'].length; i++)
		{
		  if(video_config_media['streams'][i].format == 'trailer_hls' && video_config_media['streams'][i].hardsub_lang == user_lang)
		  {
		    if(rows_number <= 5){
			video_m3u8_array.push(video_config_media['streams'][i].url.replace("clipTo/120000/", "clipTo/" + video_config_media['metadata']['duration'] + "/"));
    		    	rows_number++;
		    }
		  }
		  if(video_config_media['streams'][i].format == 'adaptive_hls' && video_config_media['streams'][i].hardsub_lang == user_lang)
		  {
		    video_stream_url = video_config_media['streams'][i].url;
		    break;
		  }
		}
		console.log(video_m3u8_array);
	
		//Verifica se é stream paga.
		if(video_stream_url == ""){
		    var playerInstance = jwplayer("player_div")
		    playerInstance.setup({
		            sources: [{
				file: video_m3u8_array[0],
        			label: '720p HD'
			      },{
				file: video_m3u8_array[1],
				label: '20p HD'
			      },{
				file: video_m3u8_array[2],
				label: '0p HD'
			      }],
		            image: video_config_media['thumbnail']['url'],
		            width: "100%",
		            height: "100%"
		    });
		}else{
		    var playerInstance = jwplayer("player_div")
		    playerInstance.setup({
		            file: video_stream_url,
		            image: video_config_media['thumbnail']['url'],
		            width: "100%",
		            height: "100%"
		    });
		}

		jwplayer().on('ready', function(e) {
			if(localStorage.getItem(video_id) != null){
				document.getElementsByTagName("video")[0].currentTime = localStorage.getItem(video_id);
			}
			document.body.querySelector(".loading_container").style.display = "none";
		});
		const interval = setInterval(function() {
			if(jwplayer().getState() == "playing"){
   				localStorage.setItem(video_id, jwplayer().getPosition());
   			}
 		}, 5000);
});
