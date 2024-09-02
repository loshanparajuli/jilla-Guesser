document.addEventListener('DOMContentLoaded', function() {
    var districts = ['achham', 'arghakhanchi', 'baglung', 'baitadi', 'bajhang', 'bajura', 'banke', 'bara', 'bardiya', 'bhaktapur', 'bhojpur', 'chitwan', 'dadeldhura', 'dailekh', 'dang', 'darchula', 'dhading', 'dhankuta', 'dhanusha', 'dolakha', 'dolpa', 'doti', 'gorkha', 'gulmi', 'humla', 'ilam', 'jajarkot', 'jhapa', 'jumla', 'kailali', 'kalikot', 'kanchanpur', 'kapilvastu', 'kaski', 'kathmandu', 'kavre', 'khotang', 'lalitpur', 'lamjung', 'mahottari', 'makwanpur', 'manang', 'morang', 'mugu', 'mustang', 'myagdi', 'nawalparasi east', 'nawalparasi west', 'nuwakot', 'okhaldhunga', 'palpa', 'panchthar', 'parbat', 'parsa', 'pyuthan', 'ramechhap', 'rasuwa', 'rautahat', 'rolpa', 'rukum east', 'rukum west', 'rupandehi', 'salyan', 'sankhuwasabha', 'saptari', 'sarlahi', 'sindhuli', 'sindhupalchowk', 'siraha', 'solukhumbu', 'sunsari', 'surkhet', 'syangja', 'tanahun', 'taplejung', 'terhathum', 'udayapur'];
    var inputField = document.getElementById('district-input');
    var timerDisplay = document.querySelector('.timer-display'); // Display element for the timer
    var timer;
    var timeRemaining = 300; // Set default time to 5 minutes (300 seconds)

    // Function to start the timer
    function startTimer() {
        timer = setInterval(function() {
            timeRemaining--;
            updateTimerDisplay();

            // Check if time is less than 30 seconds
            if (timeRemaining < 30) {
                timerDisplay.style.color = 'red'; // Change color to red
            } else {
                timerDisplay.style.color = 'black'; // Reset color to black
            }

            // If time runs out, reveal missed districts
            if (timeRemaining <= 0) {
                clearInterval(timer);
                revealMissedDistricts();
            }
        }, 1000); // Update every second
    }

    // Function to update the timer display
    function updateTimerDisplay() {
        var minutes = Math.floor(timeRemaining / 60);
        var seconds = timeRemaining % 60;
        timerDisplay.textContent = minutes + ":" + (seconds < 10 ? '0' : '') + seconds; // Display time in MM:SS format
    }

    // Function to reveal missed districts
    function revealMissedDistricts() {
        var iframe = document.getElementById('nepal-map');
        var svgDocument = iframe.contentDocument || iframe.contentWindow.document;

        districts.forEach(function(district) {
            var districtElement = svgDocument.getElementById(district);
            if (districtElement && !districtElement.classList.contains('highlight')) {
                districtElement.classList.add('missed');
                districtElement.setAttribute('data-name', district.charAt(0).toUpperCase() + district.slice(1)); // Set data-name attribute for hover effect
            }
        });
    }

    // Function to set up event listener for highlighting districts
    function setupDistrictHighlighting() {
        var iframe = document.getElementById('nepal-map');
        var svgDocument = iframe.contentDocument || iframe.contentWindow.document; // Access the embedded SVG document

        inputField.addEventListener('input', function(e) {
            var userInput = e.target.value.toLowerCase().trim();

            if (timeRemaining === 300) { // Start timer when user starts typing for the first time
                startTimer();
                inputField.placeholder = "Come on, something interesting!";
            }

            if (districts.includes(userInput)) {
                var districtElement = svgDocument.getElementById(userInput);
                if (districtElement) {
                    districtElement.classList.add('highlight'); // Highlight the district
                    e.target.value = ''; // Clear input for next guess
                }
            }
        });
    }

    setupDistrictHighlighting(); // Call the setup function on load
});
