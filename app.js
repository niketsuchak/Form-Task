function uploadPhoto() {
    const fileInput = document.getElementById('image');
    const file = fileInput.files[0];
    
    const formData = new FormData();
    formData.append('photo', file);
  
    fetch('http://localhost:3000/photos/', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }
      return response.json();
    })
    .then(data => {
      console.log(data.message); // Photo uploaded successfully
      // Handle any success actions here if needed
    })
    .catch(error => {
      console.error('Failed to upload photo:', error);
      // Handle error actions here if needed
    });
  }
  function registerUser() {
    const form = document.getElementById("registrationForm");
  
    // Get form field values
    const firstName = form.elements.firstname.value;
    const lastName = form.elements.lastname.value;
    const gender = form.elements.gender.value;
    const email = form.elements.email.value;
    const phoneNumber = form.elements.number.value;
    const dateOfBirth = form.elements.dateOfBirth.value;
    const communication = form.elements.communication.checked;
    const criticalThinking = form.elements.criticalThinking.checked;
    const problemSolving = form.elements.problemSolving.checked;
    const initiative = form.elements.initiative.checked;
  
    const professionalSkills = {
      communication,
      criticalThinking,
      problemSolving,
      initiative,
    };
  
    // Prepare the data to send to the backend
    const formData = {
      firstName,
      lastName,
      gender,
      email,
      phoneNumber,
      dateOfBirth,
      professionalSkills,
    };
  
    // Send form data to the backend
    fetch("http://localhost:3000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      // Check if the response is not a valid JSON
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // Parse the response as JSON
      return response.json();
    })
    .then((data) => {
      // Handle the response from the backend
      console.log(data); // You can do something with the response here
    })
    .catch((error) => {
      console.error("Error sending form data:", error);
    });
}
  
  
  document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally
    registerUser(); // Call the function to register the user
    uploadPhoto()
  });
  
  