<<<<<<< HEAD
# RoadRage - Fashion City Dress Blog App

## Project Description
RoadRage is a modern React-based web application designed as a fashion dress blog platform. Users can sign up or log in using Google authentication, share their style by posting outfit photos with captions, descriptions, and tags, rate outfits, and get feedback from the community. The app features a dynamic feed, post creation form, and user dashboard with interactive UI components.

## Technologies Used
- React 18
- React Router DOM for client-side routing
- Firebase Authentication (Google Sign-In)
- Firebase Firestore for user data storage
- MongoDB with Mongoose for backend user and post data persistence
- Axios for HTTP requests to backend services
- Tailwind CSS and custom CSS for styling
- React Scripts with react-app-rewired for build and development
- Testing libraries: @testing-library/react, jest-dom, user-event

## Installation and Setup Instructions
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd roadrage
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Firebase:
   - Set up a Firebase project.
   - Enable Google Authentication.
   - Configure Firestore database.
   - Update Firebase config in `src/Components/auth/firebase.js`.
4. Configure backend MongoDB connection in `src/Components/database.js/Mongodb.js`.
5. Start the development server:
   ```bash
   npm start
   ```
6. The app will be available at `http://localhost:3000`.

## Features Overview
- Google Authentication for secure login/signup.
- User dashboard with sidebar navigation.
- Create posts with image upload, caption, description, and tags.
- Dynamic feed displaying posts with interactive rating UI.
- Persistent user data and posts stored in Firebase Firestore and MongoDB.
- Responsive and styled UI using Tailwind CSS and custom styles.

## Project Structure Explanation
```
roadrage/
├── public/                      # Static assets and manifest
├── src/
│   ├── Components/
│   │   ├── auth/                # Authentication components and Firebase config
│   │   │   └── firebase.js      # Firebase setup and Google sign-in functions
│   │   │   └── Mainlanding.js   # Landing page component handling Google login, user state, and Firestore user creation
│   │   ├── componentsofpage1/   # Main UI components for dashboard and feed
│   │   │   ├── feed.jsx         # Displays posts feed, sends posts to backend, shows post details and rating UI
│   │   │   ├── sidebar.jsx      # Sidebar component managing navigation modes and visibility state
│   │   │   ├── chat.jsx         # Chat component (functionality not fully explored)
│   │   │   ├── Postform.js      # Post form component (alternative or additional to DressForm)
│   │   │   ├── post.js          # Post display component (used in feed or home)
│   │   │   ├── index.css        # CSS styles for these components
│   │   ├── database.js/         # Backend database models and MongoDB connection
│   │   │   ├── Mongodb.js       # MongoDB connection setup
│   │   │   ├── usermodel.js     # Mongoose schema for user data
│   │   │   ├── postmodel.js     # Mongoose schema for post data
│   │   ├── DressForm.jsx        # Post creation form component managing image, caption, description, tags states and submission
│   │   ├── Mainnav.jsx          # Navigation bar component with sidebar toggle and user info
│   ├── App.js                   # Main app component
│   │   ├── Manages user state with useState and useEffect hooks for localStorage persistence
│   │   ├── Sets up React Router with routes for LandingPage ("/") and Dashboard ("/dashboard")
│   ├── Mainpage.js              # Dashboard page component
│   │   ├── Manages mode state (create, feed, home) and sidebar visibility
│   │   ├── Handles post state and submission via createPost function
│   │   ├── Renders Navbar, Sidebar, and main content conditionally based on mode
│   ├── index.js                 # React app entry point rendering App component inside React.StrictMode
├── package.json                 # Project dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
├── postcss.config.js            # PostCSS configuration
```

## Authentication Details
- Uses Firebase Authentication with Google Sign-In.
- On first login, user data is saved to Firestore with fields like uid, email, username, photo, totalLikes, and totalPosts.
- User session is persisted in localStorage.

## Database Details
- Firebase Firestore stores user profile data.
- MongoDB with Mongoose stores detailed user and post data.
- User schema includes uid, username, email, photo, likes, ratings, posts count, and timestamps.
- Posts include image, caption, description, tags, and creator info.

## Usage Instructions
- On landing page, users can sign up or log in with Google.
- After login, users are redirected to the dashboard.
- Use the sidebar to navigate between creating posts and viewing the feed.
- Create posts by uploading images and adding captions, descriptions, and tags.
- View posts in the feed with options to rate and interact.
- User data and posts are saved and updated in real-time.

## Screenshots or Images Reference
- The app includes styled UI with pink-themed gradients and fonts.
- Screenshot available in `public/Screenshot 2025-06-04 214850.png`.
- Cookie Monster image asset in `public/Cookie Monster.png`.

## Contribution and License
- Contributions are welcome via pull requests.
- Please follow the existing code style and structure.
- License information to be added as per project requirements.

---

This README provides a comprehensive overview of the RoadRage project to help developers and AI models understand the app's purpose, structure, and usage.
=======
# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/7cb15b77-83f5-434e-8b73-5f731171453d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/7cb15b77-83f5-434e-8b73-5f731171453d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/7cb15b77-83f5-434e-8b73-5f731171453d) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
>>>>>>> 227b7016932104ff9b8017c40ef7fa4329399de8
