/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready


let editingContactId = null;
let currentImageURI = null;

const STORAGE_KEY = 'phonebook_contacts';

document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    console.log("Cordova is ready");
    initApp();
}

function initApp() {
    const form = document.getElementById('contactForm');
    const searchInput = document.getElementById('search');
    const captureImageButton = document.getElementById('captureImage');

    form.onsubmit = addContact;
    searchInput.oninput = filterContacts;

    captureImageButton.onclick = captureImage;

    renderContacts();
}

function captureImage() {
    navigator.camera.getPicture(onSuccess, onFail, {
        quality: 50,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: Camera.PictureSourceType.PHOTOLIBRARY, // Open the photo gallery
        mediaType: Camera.MediaType.PICTURE
    });

    function onSuccess(imageURI) {
        // Store the selected image URI
        currentImageURI = imageURI;

        // Update the UI with the image
        const img = document.createElement('img');
        img.src = imageURI;
        img.className = 'profile-image';

        console.log("Image URI: ", imageURI); // Log the image URI to console
    }

    function onFail(message) {
        console.log("Image selection failed: " + message);
    }
}

function addContact(event) {
    event.preventDefault();

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    // Validate inputs (ensure name and phone are not empty)
    if (!name || !phone || !email) {
        alert('Please fill name, email and phone number');
        return;
    }

    // Validate phone number: exactly 10 digits
    const phonePattern1 = /^\d{10}$/; // Only allow exactly 10 digits
    if (!phonePattern1.test(phone)) {
        alert("Please enter a valid phone number with exactly 10 digits.");
        return;
    }

    // Validate phone number format (only digits, spaces, + and -)
    const phonePattern2 = /^[0-9+\-\s]{6,}$/;
    if (!phonePattern2.test(phone)) {
        alert("Please enter a valid phone number.");
        return;
    }

    // Get existing contacts from localStorage
    let contacts = getContacts();

    if (editingContactId) {
        // Update an existing contact
        contacts = contacts.map(contact => {
            if (contact.id === editingContactId) {
                return { ...contact, name, email, phone, imageURI: currentImageURI };
            }
            return contact;
        });
        editingContactId = null; // Reset the editing mode
    } else {
        // Add a new contact
        const contact = {
            id: Date.now(),
            name,
            email,
            phone,
            imageURI: currentImageURI // Save the image URI
        };
        contacts.push(contact);
    }

    saveContacts(contacts);

    nameInput.value = '';
    phoneInput.value = '';
    emailInput.value = '';
    currentImageURI = null; // Reset image after adding

    const submitButton = document.querySelector('#contactForm button');
    submitButton.textContent = 'Add Contact';

    renderContacts();
}

function filterContacts() {
    const searchQuery = this.value.trim(); // 'this' refers to the search input field
    renderContacts(searchQuery);
}

function getContacts() {
    const storedContacts = localStorage.getItem(STORAGE_KEY);
    return storedContacts ? JSON.parse(storedContacts) : [];
}

function saveContacts(contacts) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function renderContacts(searchQuery = '') {
    const list = document.getElementById('contactList');
    const emptyState = document.getElementById('emptyState');

    const contacts = getContacts();

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    list.innerHTML = '';

    if (filteredContacts.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
    }

    filteredContacts.forEach(contact => {
        const li = document.createElement('li');
        li.className = 'contact-item';

        // Contact container (left: image, right: name/phone)
        const contactContainer = document.createElement('div');
        contactContainer.className = 'contact-container';

        const imageAndInfoContainer = document.createElement('div');
        imageAndInfoContainer.className = 'image-info-container';

        // Left container: profile image
        const imageContainer = document.createElement('div');
        imageContainer.className = 'image-container';
        const img = document.createElement('img');
        img.className = 'profile-image';
        img.src = contact.imageURI || 'img/illuminats.png'; // Show a default image if none is available
        imageContainer.appendChild(img);
        imageAndInfoContainer.appendChild(imageContainer);

        // Right container: name and phone number
        const infoContainer = document.createElement('div');
        infoContainer.className = 'info-container';
        //name
        const nameSpan = document.createElement('span');
        nameSpan.className = 'contact-name';
        nameSpan.textContent = `${contact.name}`;
        //phone
        const phoneSpan = document.createElement('span');
        phoneSpan.className = 'contact-phone';
        phoneSpan.textContent = `${contact.phone}`;
        //email
        const emailSpan = document.createElement('span');
        emailSpan.className = 'contact-email';
        emailSpan.textContent = `${contact.email}`;

        infoContainer.appendChild(nameSpan);
        infoContainer.appendChild(emailSpan);
        infoContainer.appendChild(phoneSpan);
        imageAndInfoContainer.appendChild(infoContainer);

        contactContainer.appendChild(imageAndInfoContainer);

        // Bottom container for buttons
        const btnContainer = document.createElement('div');
        btnContainer.className = 'btn-container';

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'btn-edit';
        editBtn.onclick = () => editContact(contact);
        btnContainer.appendChild(editBtn);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'btn-delete';
        deleteBtn.onclick = () => handleDeleteContact(contact.id);
        btnContainer.appendChild(deleteBtn);

        contactContainer.appendChild(btnContainer);

        li.appendChild(contactContainer);
        list.appendChild(li);
    });
}

function editContact(contact) {
    document.getElementById('name').value = contact.name;
    document.getElementById('phone').value = contact.phone;
    document.getElementById('email').value = contact.email;

    const submitButton = document.querySelector('#contactForm button');
    submitButton.textContent = 'Update Contact';

    editingContactId = contact.id;

    // Display the existing profile image
    currentImageURI = contact.imageURI;
    const imageElement = document.getElementById('profileImage');
    imageElement.src = contact.imageURI || 'img/illuminats.png'; // Show existing image or default
}

function handleDeleteContact(id) {
    if (!confirm("Are you sure you want to delete this contact?")) {
        return;
    }

    let contacts = getContacts();
    contacts = contacts.filter(contact => contact.id !== id);
    saveContacts(contacts);

    renderContacts();
}
