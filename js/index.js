// Initialize Firebase
var config = {
	apiKey: "AIzaSyCTeixZmqc8b5NwzPNbdr0Kd0KDycHVdXc",
	authDomain: "sneaker-catalog.firebaseapp.com",
	databaseURL: "https://sneaker-catalog.firebaseio.com",
	projectId: "sneaker-catalog",
	storageBucket: "sneaker-catalog.appspot.com",
	messagingSenderId: "1057724970282"
};
firebase.initializeApp(config);


// File image preview
function previewFile() {
	var preview = document.getElementById('thumbnail-preview'); //document.querySelector('img');
	var file = document.querySelector('input[type=file]').files[0];
	var reader = new FileReader();

	reader.addEventListener("load", function () {
		preview.src = 'images/' + file.name; //reader.result;
	}, false);

	if (file) {
		reader.readAsDataURL(file);
	}
}

$(function () {

	// table sorter plugin with default options 
	$('#items-table').tablesorter();

	//Conect to Firebase
	var database = firebase.database();

	$('#post-catalog').on('click', function (event) {

		// create a section for collection data in db
		var collection = database.ref('collection');
		
		// sneaker object to push to collection array
		var sneaker = {
			brand: $('#brand').val(),
			model: $('#model').val(),
			releaseYear: $('#release-year').val(),
			purchaseDate: $('#purchase-date').val(),
			sellDate: $('#sell-date').val(),
			thumbnail: $('#thumbnail-preview').attr('src')
		}

		collection.push(sneaker);

	});

	// EVENT LISTENERS

	// use reference to app database to listen for changes in collection data
	database.ref('collection').on('value', function (response) {

		// This is essentially ARRAY of OBJECTS from Firebase
		var collection = response.val();

		// clear message board
		$('#sneaker-collection').html('');

		// interate through collection object and get each item
		$.each(collection, function (key, sneaker) {

			var s = '';
			s += '<tr data-id="' + key + '">';
			s += '	<td class="edit">' + sneaker.brand + '</td>';
			s += '	<td>' + sneaker.model + '</td>';
			s += '	<td>' + sneaker.releaseYear + '</td>';
			s += '	<td>' + sneaker.purchaseDate + '</td>';
			s += '	<td>' + sneaker.sellDate + '</td>';
			s += '	<td width="20%"><img src="' + sneaker.thumbnail + '" class="table-thumbnail" /></td>';
			s += '	<td class="text-center"><i class="fa fa-trash delete"></i></td>';
			s += '</tr>';
			
			$('#sneaker-collection').append(s);

			// letting table sorter know we made an update
			$("#sneaker-table").trigger("update");

		});


	});

	// Attach delete event listeners to all delete buttons in the sneaker collection table:
	$('#sneaker-collection').on('click', '.delete', function (event) {


		// get the value of the data-id attribute in the parent <li>
		var id = $(this).parent().parent().data('id');
		database.ref('collection/' + id).remove();
	});


	$('#sneaker-collection').on('click', '.edit', function (event) {

		// get the value of the data-id attribute in the parent <tr>
		var id = $(this).parent().data('id');
		console.log(id);
		var content = $(this).siblings('.content').val();

		//database.ref('collection/' + id).update({
			//content: content
		//});

	});

});
