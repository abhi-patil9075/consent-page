function restrictInput(element, event) {
    
    if (event.type === "paste") {
        blur();
		return false;
    }

	if (!event)
		var event = window.event;
	if (event.keyCode)
		code = event.keyCode;
	else if (event.which)
		code = event.which;
    var character = String.fromCharCode(code);
	
	if (code == 27) {
		blur();
		return false;
	}

	if (!event.ctrlKey && code != 9 && code != 8 && code != 36 && code != 37 && code != 38 && (code != 39 || (code == 39 && character == "'")) && code != 40) {
		if (character.match(/[1234567890]/g)) {
			return !isNaN(element.value.toString() + character);
		}
        return false;
	}
}

async function submitConsentForm(){
	let name = $(`#name`).val();
	let dateOfBirth = $(`#dob`).val();
	let lan = $(`#lan`).val();
	if(validateStringValue(name) && validateStringValue(dateOfBirth) && validateStringValue(lan)){
		let userInfo = {
			name : name,
			dateOfBirth : dateOfBirth,
			lan : lan
		}
		let status = await validateCustomer(userInfo);
		if(status){
			nextStep();
		}
	}
	
}

function validateStringValue(string){
	if(string != undefined && string != null && string.trim() != ""){
		return true;
	}
	return false;
}

function nextStep(){
	$(`#wizrd_1_pro`).removeClass(`active_wizrd`).addClass('completed');
	$(`#wizrd_2_pro`).addClass(`active_wizrd`);

	$(`#step-1-div`).hide();
	$(`#step-2-div`).show();
	$(`.downArrow`).show();	
}

async function validateCustomer(userInfo){
	let status = true;
	// this will check costumer in server site 
	// await $.ajax({
    //     type : "GET",
    //     url : YOUR_URL,
	// 	data: JSON.stringify(userInfo),
    //     error : function(response, error, thrownError) {
    //         displayError(response, error, thrownError);
    //     },
    //     success : function success(response) {
    //         var res = eval(response);
    //         status = res.status;
    //     }
	// });

	return status;
}


function fillInfoAndValidate(){
    // get user name

    // get lan number

    // get dob

    // send to verifiy by ajax

    // get responce. if the responce is true the show the term and condition page to accept the consent  else show the wrong credintional message to user.

}

function acceptAgriment(){
    
}

