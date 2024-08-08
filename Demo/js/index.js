

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
			fillUserInfoInConsentPage(userInfo);
		}
	}else{
		
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
	

function fillUserInfoInConsentPage(userInfo) {
	let today = new Date();
	const formattedDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(today);
	$("#userName").html(userInfo.name);
	$("#userDob").html(userInfo.dateOfBirth);
	$("#userLan").html(userInfo.lan);
	$("#consentDate").html(formattedDate);
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

async function acceptAgreement(){

	const isChecked = $("#agreeTermAndCond").is(":checked");
	if(isChecked){
		// Load jsPDF library
		const { jsPDF } = window.jspdf;
				
		// Create a new jsPDF instance
		const doc = new jsPDF();
		
		// Capture the HTML content using html2canvas
		const content = document.getElementById('consent-content-div-to-pdf');
		const canvas = await html2canvas(content, { scale: 1 });
		const imgData = canvas.toDataURL('image/png');

		// Add the captured image to the PDF
		const imgWidth = 190; // Width of the PDF page in mm
		const pageHeight = 297; // Height of the PDF page in mm
		const imgHeight = (canvas.height * imgWidth) / canvas.width;
		let heightLeft = imgHeight;
		let position = 0;

		doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
		heightLeft -= pageHeight;

		while (heightLeft >= 0) {
			position = heightLeft - imgHeight;
			doc.addPage();
			doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;
		}

		// Save the PDF
		doc.save('hello_world.pdf');
	}else{
		alert(" Please check the check box to continue!")
	}

       

	
}




