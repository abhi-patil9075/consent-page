
/**
 * @description This function is used to restrict alphabetic values in LAN number input
 * @param element 
 * @param event 
 */
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

/**
 * @description This function is used to submit consent confirmation form. 
 * This will also validate the form if data is full fill then user can proceed on next step
 */
async function submitConsentForm(){
	const forms = document.querySelectorAll('#consent-form');

	Array.from(forms).forEach(async form => {
		form.addEventListener('submit', async event => {
			event.preventDefault();
			if (!form.checkValidity()) {
				event.stopPropagation();
				form.classList.add('was-validated');
			}else{
				let userInfo = getCustomerFormData();
				nextStep();
				fillUserInfoInConsentPage(userInfo);
			}

		}, false);
	});
}

/**
 * @description This function is used to hide first step and show second step 
 */
function nextStep(){

	$(`#wizrd_1_pro`).removeClass(`active_wizrd`).addClass('completed');
	$(`#wizrd_2_pro`).addClass(`active_wizrd`);

	$(`#step-1-div`).hide();
	$(`#step-2-div`).show();
	$(`.downArrow`).show();	
}

/**
 * @description This function is used to hide second step and show first step
 */
function prevStep(){
	$(`#wizrd_1_pro`).addClass(`active_wizrd`).removeClass('completed');
	$(`#wizrd_2_pro`).removeClass(`active_wizrd`);
	
	$(`#step-1-div`).show();
	$(`#step-2-div`).hide();
	$(`.downArrow`).hide();	
}
	
/**
 * @description This function is used to fill the user data in consent page on step 2
 * @param userInfo 
 */
function fillUserInfoInConsentPage(userInfo) {
	let today = new Date();
	const formattedDate = new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(today);
	$("#userName").html(userInfo.name);
	$("#userDob").html(userInfo.dateOfBirth);
	$("#userLan").html(userInfo.lan);
	$("#consentDate").html(formattedDate);
}

/**
 * @description This function is used to save data in server site and download a pdf file
 */
async function acceptAgreement(){

	const isServerAvailable = false ; // This variable help to not to make BE call this the time it get available 
	const isChecked = $("#agreeTermAndCond").is(":checked");
	if(isChecked){

		let userData = getCustomerFormData();
		if(isServerAvailable){
			let responseObject = await saveConsentDataAjax(userData); 
			if(responseObject && responseObject.status == true){
				downloadPDF(userData);
			}else{
				showError(responseObject.errorMessage);
			}
		}else{
			downloadPDF(userData);
		}
	}
}

/**
 * @description This function is used to initialize date picker for date of birth.
 * 	We have using bootstrap datepicker library for pick date from calender
 */
function initializeDatePicker(){
	const dateInput = $(`#dob`);
    dateInput.datepicker({
        format: 'dd-mm-yyyy',
        autoclose: true,
		defaultViewDate: { year: 2000, month: 0, day: 1 },
        todayHighlight: true,
    });

	$(`#dateIcon`).on('click', function() {
		dateInput.datepicker('show');
	});
}

/**
 * @description Here we have initialize the all page load event
 */
function initEvents(){
	
	$(window).on('scroll', function() {
		if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
			$(`.downArrow`).hide(); // Hide the div
		} else {
			$(`.downArrow`).show(); // Show the div
		}
	});

	$('#continue-btn').prop('disabled', true);

	// agree term and condition button visibility. 
	$('#agreeTermAndCond').change(function() {
		if ($(this).is(':checked')) {
			$('#continue-btn').prop('disabled', false);
		} else {
			$('#continue-btn').prop('disabled', true);
		}
	 });
}

async function downloadPDF(userData){
	// Load jsPDF library
	const { jsPDF } = window.jspdf;
					
	// Create a new jsPDF instance
	const doc = new jsPDF();

	// Capture the HTML content using html2canvas
	const content = document.getElementById('consent-content-div-to-pdf');
	const canvas = await html2canvas(content, { scale: 1.5 });
	const imgData = canvas.toDataURL('image/jpeg');

	// Add the captured image to the PDF
	const toPadding = 10;
	const imgWidth = 190; // Width of the PDF page in mm
	const pageHeight = 297; // Height of the PDF page in mm
	const imgHeight = (canvas.height * imgWidth) / canvas.width;
	let heightLeft = imgHeight;
	let position = 0;

	doc.addImage(imgData, 'JPEG', 10, position + toPadding, imgWidth, imgHeight);
	heightLeft -= pageHeight;

	while (heightLeft >= 0) {
		position = heightLeft - imgHeight;
		doc.addPage();
		doc.addImage(imgData, 'JPEG', 10, position + toPadding, imgWidth, imgHeight);
		heightLeft -= pageHeight;
	}

	// Save the PDF
	let userName = userData.name.replaceAll(" ","_");
	let pdfName = userName + "-avanse-consent.pdf";
	doc.save(pdfName);
}

/**
 * @description This function is used to get user data object form consent from
 * @returns userInfo
 */
function getCustomerFormData(){
	let userInfo = {
		name : $(`#name`).val(),
		dateOfBirth : $(`#dob`).val(),
		lan : $(`#lan`).val()
	}

	return userInfo;
}

/**
 * @description This is ajax which is save the user data in server site
 * @param userData 
 */
async function saveConsentDataAjax(userData){
	let responseObject;
	await $.ajax({
        type : "POST",
        url : YOUR_URL,
		data: userData,
        error : function(response, error, thrownError) {
            displayError(response, error, thrownError);
        },
        success : function success(response) {
            responseObject = response;
        }
	});

	return responseObject;
}

/**
 * @description This function is used to show error message 
 * @param errorMessage 
 */
function showError(errorMessage){
	$.toast({
		text:errorMessage, 
		position : 'top-right',
		bgColor : 'orange',
		textColor : '#eee' 
	});
}