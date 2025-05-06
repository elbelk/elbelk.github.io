document.querySelectorAll('.carousel').forEach(carousel => {
    const track = carousel.querySelector('.carousel-track'); // The flex track that holds the slides
    const slides = Array.from(track.children); // The slides inside the track that contain the images
    const nextButton = carousel.querySelector('.carousel-button.next'); // The right button that goes to the next slide
    const prevButton = carousel.querySelector('.carousel-button.prev'); // The left button that goes to the previous slide
    const indicatorsContainer = carousel.querySelector('.carousel-indicators-container'); // The container that holds the dots at the bottom of the carousel that indicate the current slide
    const counterDisplay = carousel.querySelector('.carousel-counter'); // The counter div in the top left corner of the carousel that shows the current (non-clone) slide number and the total number of (non-clone) slides as a fraction
    const totalSlides = slides.length; // The total number of non-clone slides
    let isFirstLoad = true; // Boolean to track if it's the first load page load - used to disable the slide transition on first load
    let isMoving = false; // Boolean to check if the carousel is currently transitioning (or moving)

    // Clone first and last slides 
    const firstClone = slides[0].cloneNode(true); // Create a clone of the first slide
    const lastClone = slides[slides.length - 1].cloneNode(true); // Create a clone of the last slide
    track.appendChild(firstClone); // Add the first slide clone to the end of the track
    track.insertBefore(lastClone, slides[0]); // Add the last slide clone to the beginning of the track

    // Get all of the slides including clones
    //const allSlides = Array.from(track.children); // All the slides including the clones - Never Used

    // Create an index to track the current slide, and set the initial transform of the track to show the first non-clone slide
    let currentIndex = 1; // The current index for all of the slides including the clones. Starts at 1 for the first non-clone slide, skipping the first clone at index 0.
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Create indicator dots (only for real slides)
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button'); // Create a dot button for each slide
        if (i === 0) dot.classList.add('active'); // Set the first dot as active because the carousel starts on the first non-clone slide
        indicatorsContainer.appendChild(dot); // Add the dot to the indicators container
        dot.addEventListener('click', () => { // Add click event logic to each dot
            currentIndex = i + 1; // account for extra clone at start
            updateCarousel();
        });
    }

    // Update the track transform, transition, active dot, counter display, and the realIndex (including clones) when the next or previous buttons are clicked or the dot buttons are clicked
    const updateCarousel = () => {
        if (isFirstLoad) { // If it's the first load, disable the track transition
            track.style.transition = 'none'; // Temporarily disable transition on first load
            isFirstLoad = false; // Reset the flag after the first load
        } else { // If it's not the first load, enable the transition
            track.style.transition = 'transform 0.5s ease-in-out'; // Enable transition for all updates after the first load
        }

        track.style.transform = `translateX(-${currentIndex * 100}%)`; // Update the track transform to show the current slide (this includes the clones before the carousel cycles around unless the next or previous buttons are clicked before the transition ends)

        // Calculate the real index (for non-clone slides) and update the counter display and active dot indicator
        const realIndex = (currentIndex - 1 + totalSlides) % totalSlides; // The real index including the clones - used to update both the counter display and the active dot indicator. Used instead of currentIndex because currentIndex includes the clones. The real index is calculated by subtracting 1 from currentIndex (to account for the first clone) and then using modulo to wrap around the realIndex if it goes below 0 or above totalSlides - 1.
        counterDisplay.textContent = `${realIndex + 1}/${totalSlides}`; // Update the counter display to show the current non-clone slide number and total number of non-clone slides

        // Update the active dot indicator to show the current active (non-clone) slide
        indicatorsContainer.querySelectorAll('button').forEach((dot, index) => {
            dot.classList.toggle('active', index === realIndex);
        });
    };

    // Add an event listener to the next button to go to the next slide - accounting for rapid button clicks
    nextButton.addEventListener('click', () => {
        // Optional code to use instead to ignore additional clicks while transitioning
        // if (!isMoving) {
        //     currentIndex++;
        //     updateCarousel();
        //     isMoving = true;
        // }

        // If the carousel is moving while the button is clicked, quickly complete the transition by jumping to the current slide, then wrap around if on a clone slide
        if (isMoving) {
            jumpToCurrentSlide();
        }
        // Increment the current index, call updateCarousel to go to the next slide, and set isMoving to true to indicate that the carousel is currently transitioning
        currentIndex++;
        updateCarousel();
        isMoving = true;
    });

    // Add an event listener to the previous button to go to the previous slide - accounting for rapid button clicks
    prevButton.addEventListener('click', () => {
        // Optional code to use instead to ignore additional clicks while transitioning
        // if (!isMoving) {
        //     currentIndex--;
        //     updateCarousel();
        //     isMoving = true;
        // }

        // If the carousel is moving while the button is clicked, quickly complete the transition by jumping to the current slide, then wrap around if on a clone slide
        if (isMoving) {
            jumpToCurrentSlide();
        }
        // Decrement the current index, call updateCarousel to go to the previous slide, and set isMoving to true to indicate that the carousel is currently transitioning
        currentIndex--;
        updateCarousel();
        isMoving = true;
    });

    // Jump to the current slide (the one currently being transitioned to), then wrap around if on a clone slide
    const jumpToCurrentSlide = () => {
        track.style.transition = 'none';
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        void track.offsetWidth; // forces reflow
        wrapIfOnClone();
    };

    // After completing a transition, wrap around if on a clone slide, and set isMoving to false to indicate that the carousel is no longer transitioning
    track.addEventListener('transitionend', () => {
        wrapIfOnClone(); // Check if we are on a clone and wrap around
        isMoving = false;
    });

    // Check if carousel is on a clone slide and wrap around if necessary
    const wrapIfOnClone = () => {
        if (currentIndex <= 0) {
            track.style.transition = 'none';
            currentIndex = totalSlides;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            void track.offsetWidth;
        }
        if (currentIndex >= totalSlides + 1) {
            track.style.transition = 'none';
            currentIndex = 1;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            void track.offsetWidth;
        }
    }

    // The first call to updateCarousel on page load to set the initial state of the carousel (slide, counter, and active dot) - happens with no transition
    updateCarousel();
});