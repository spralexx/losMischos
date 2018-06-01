var ratioSlider;
function init(){
setupEvents();	
setupSlider();	

}


function setupSlider(){
	
	ratioSlider=$("#ratio").slider({
		reversed: true
	});
	
}

function setupEvents(){
	var form = document.getElementById('drink');
	form.addEventListener('submit', function (e) {
		e.preventDefault();
		
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				
				console.log(this.responseText);
				var p = document.getElementById('status');
				p.innerHTML = this.responseText;
				if (this.responseText == 'Drink is beeing prepared') {
					setTimeout(function () { location.reload(); }, 1500);
				}
			}
		};
		xhttp.open('POST', '/drinkorder', true);
		xhttp.setRequestHeader('Content-Type', 'application/json');
		xhttp.send(JSON.stringify({ soft: document.querySelector('input[name="soft"]:checked').value, alc: document.querySelector('input[name="alc"]:checked').value, ratio: ratioSlider.slider("getValue") }));
		//console.log({ soft: document.querySelector('input[name="soft"]:checked').value, alc: document.querySelector('input[name="alc"]:checked').value, ratio: ratioSlider.slider("getValue")})
	});
	
}




window.addEventListener('load', init);