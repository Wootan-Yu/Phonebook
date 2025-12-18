# **Phonebook App**

A simple and efficient mobile application built with Cordova that allows users to manage their contacts. The app allows users to add, edit, delete, and search for contacts. Each contact includes a name, phone number, email, and an optional profile image. This app leverages the **Cordova Camera Plugin** for selecting profile pictures from the photo gallery.

---

## **Features**

- **Add Contact**: Users can add contacts with name, phone number, email, and an optional profile picture.
- **Edit Contact**: Edit the details of an existing contact.
- **Delete Contact**: Remove contacts from the phonebook.
- **Search**: Search contacts by name.
- **Phone Number Validation**: Ensures that the phone number entered contains exactly **10 digits**.
- **Profile Picture**: Allows users to choose a profile picture from their device's photo library.
- **Form Validation**: Basic validation for required fields (name, phone, and email).


## **Installation & Setup**

Steps to Run the App

Clone the Repository:

Clone the project repository to your local machine:

git clone https://github.com/Wootan-Yu/phonebook-app.git
cd phonebook-app


Install Dependencies:

Cordova plugins need to be installed:

cordova plugin add cordova-plugin-camera


Add Platforms:

You need to add the platform(s) where you want to run the app.

For Android:

cordova platform add android


For iOS (macOS only):

cordova platform add ios


Build the App:

After adding the platforms, build the app.

For Android:

cordova build android


For iOS:

cordova build ios


Run the App:

Once the build is successful, you can run the app on your device.

For Android:

cordova run android


For iOS:

cordova run ios

App Structure

The app is organized in a simple structure:

index.html: The main HTML structure of the app, including forms for adding contacts, a search bar, and the contact list.

index.js: Contains the core JavaScript logic for adding, editing, deleting, and searching contacts. It also handles form validation and integrates with the Cordova Camera Plugin for selecting profile images.

css/styles.css: Contains the app's styling (e.g., layout, buttons, contact list).

The app structure looks like this:

/phonebook-app
    /www
        /css
            styles.css           # Main CSS for the app
        /js
            index.js            # App logic
        /img
            illuminats.png      # Default profile image
        index.html             # Main HTML page
    /plugins
        cordova-plugin-camera  # Installed Cordova plugin for camera functionality
    config.xml                 # Configuration file for Cordova
    package.json               # NPM dependencies and scripts

Cordova Plugins Used

cordova-plugin-camera:

This plugin allows the app to access the camera and photo library to select a profile image.

Installation:

cordova plugin add cordova-plugin-camera


cordova-plugin-vibration (Optional):

You can add this plugin to provide haptic feedback (vibration) when a user interacts with the app (e.g., invalid phone number).

Installation:

cordova plugin add cordova-plugin-vibration

App Features in Detail
Add Contact

Users can add new contacts by filling out the form with the following details:

Name: The contact's name.

Email: The contact's email address.

Phone Number: A phone number that must be exactly 10 digits.

Profile Picture: An optional feature that allows the user to select a profile picture from the device's photo gallery.

Edit Contact

Users can update existing contact details by selecting the Edit button. The form is pre-populated with the contact's current details, and the user can update them.

Delete Contact

Contacts can be deleted by selecting the Delete button next to a contact. The app will ask for confirmation before deleting the contact from the list.

Search Functionality

Users can search for contacts by name. The contact list is dynamically filtered based on the search input.

Validation Details

Phone Number Validation: The app validates the phone number to ensure it contains exactly 10 digits. If the number is not valid, an alert is shown to the user.

Email Validation: The email input is validated to ensure it matches the correct email format.

Required Fields: The app ensures that all required fields (name, phone, and email) are filled before submitting the form.

### **Prerequisites**

- **Node.js**: Make sure Node.js is installed on your machine.
- **Cordova**: Install Cordova globally via npm if you haven’t already:

  ```bash
  npm install -g cordova
