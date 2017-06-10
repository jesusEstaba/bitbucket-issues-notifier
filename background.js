
var BADGE_LOADING = {color:[255, 0, 0, 255]};
var passbit = "hWYeVfYcwz7KFqcSuwHD";
var COUNTERNOTIFICATION = 0;


function notification(num) {
	COUNTERNOTIFICATION += num;
	chrome.browserAction.setBadgeText({text: COUNTERNOTIFICATION + ''});
	chrome.browserAction.setBadgeBackgroundColor(BADGE_LOADING);	
}

function ajaxGetWithAuth(datafn) {
	$.ajax({
	    url: "https://api.bitbucket.org" + datafn.api,
	    beforeSend: function(xhr) { 
	      xhr.setRequestHeader("Authorization", "Basic " + btoa("rakzodia:hWYeVfYcwz7KFqcSuwHD")); 
	    },
	    type: 'GET',
	    dataType: 'json',
	    contentType: 'application/json',
	    success: datafn.done,
	    error: function(){
	      console.error("Cannot get data");
	    }
	});
}

/*
ajaxGetWithAuth('repositories/rakzodia/cronos-project/issues', function (data) {      
	var newsIssues = 0;

	data.issues.forEach(issue => {
		console.log(issue.status)
		if (issue.status=="new") {
			newsIssues++;
		}
	})

	if (newsIssues) {
		chrome.browserAction.setBadgeBackgroundColor(BADGE_LOADING);
		chrome.browserAction.setBadgeText({text: newsIssues + ''});
	}
});
*/

ajaxGetWithAuth({
	api: '/1.0/user/repositories', 
	done: function (data) {
		data.forEach(repo => {
			
			if (repo.has_issues) { 
				ajaxGetWithAuth({
					api: repo.resource_uri + '/issues?status=new&limit=50', 
					done: function (datainner) {
						console.log(repo.resource_uri)
						console.log(datainner.issues)

						notification(datainner.issues.length)						
					}
				});
			}
		})
	}
});

