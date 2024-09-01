<script>
    const districts = ['achham', 'arghakhanchi', 'baglung', 'baitadi', 'bajhang', 'bajura', 'banke', 'bara', 'bardiya', 'bhaktapur', 'bhojpur', 'chitwan', 'dadeldhura', 'dailekh', 'dang', 'darchula', 'dhading', 'dhankuta', 'dhanusha', 'dolakha', 'dolpa', 'doti', 'gorkha', 'gulmi', 'humla', 'ilam', 'jajarkot', 'jhapa', 'jumla', 'kailali', 'kalikot', 'kanchanpur', 'kapilvastu', 'kaski', 'kathmandu', 'kavre', 'khotang', 'lalitpur', 'lamjung', 'mahottari', 'makwanpur', 'manang', 'morang', 'mugu', 'mustang', 'myagdi', 'nawalparasi east', 'nawalparasi west', 'nuwakot', 'okhaldhunga', 'palpa', 'panchthar', 'parbat', 'parsa', 'pyuthan', 'ramechhap', 'rasuwa', 'rautahat', 'rolpa', 'rukum east', 'rukum west', 'rupandehi', 'salyan', 'sankhuwasabha', 'saptari', 'sarlahi', 'sindhuli', 'sindhupalchowk', 'siraha', 'solukhumbu', 'sunsari', 'surkhet', 'syangja', 'tanahun', 'taplejung', 'terhathum', 'udayapur'];
    const inputField = document.getElementById('district-input');
    const timerDisplay = document.querySelector('.timer-display'); // Display element for the timer
    let timer;
    let timeRemaining = 300; // Set default time to 5 minutes (300 seconds)

    // Function to start the timer
    function startTimer() {
        timer = setInterval(() => {
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
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Display time in MM:SS format
    }

    // Function to reveal missed districts
    function revealMissedDistricts() {
        const iframe = document.getElementById('nepal-map');
        const svgDocument = iframe.contentDocument || iframe.contentWindow.document;

        districts.forEach(district => {
            const districtElement = svgDocument.getElementById(district);
            if (districtElement && !districtElement.classList.contains('highlight')) {
                districtElement.classList.add('missed');
            }
        });
    }

    // Function to set up event listener for highlighting districts
    function setupDistrictHighlighting() {
        const iframe = document.getElementById('nepal-map');
        const svgDocument = iframe.contentDocument || iframe.contentWindow.document; // Access the embedded SVG document

        inputField.addEventListener('input', (e) => {
            const userInput = e.target.value.toLowerCase().trim();

            if (timeRemaining === 300) { // Start timer when user starts typing for the first time
                startTimer();
                inputField.placeholder = "Come on, something interesting!";
            }

            if (districts.includes(userInput)) {
                const districtElement = svgDocument.getElementById(userInput);
                if (districtElement) {
                    districtElement.classList.add('highlight'); // Highlight the district
                    e.target.value = ''; // Clear input for next guess
                }
            }
        });
    }

    window.onload = setupDistrictHighlighting; // Call the setup function on load
</script>
