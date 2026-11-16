# My Node.js TypeScript Project

This project is a Node.js application built with TypeScript, featuring a MongoDB connection and a complete authentication system. It includes configurations for SendGrid and AWS S3 for email and file storage, respectively.

## Table of Contents

- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [License](#license)

## Installation

1. Clone the repository:
  ```
  git clone <repository-url>
  cd store-be
  ```

2. Install dependencies:
  ```
  npm install
  ```

3. Create a `.env` file in the root directory and add your configuration variables (see [Configuration](#configuration) for details).

## Configuration

The following environment variables are required in the `.env` file:

```
DB_URI=<your_mongodb_connection_string>
SENDGRID_API_KEY=<your_sendgrid_api_key>
AWS_ACCESS_KEY_ID=<your_aws_access_key_id>
AWS_SECRET_ACCESS_KEY=<your_aws_secret_access_key>
AWS_REGION=<your_aws_region>
S3_BUCKET_NAME=<your_s3_bucket_name>
PORT=3004
```

## Running the Application

To start the server, run:

```
npm run start
```

The server will run on `http://localhost:3004`.

## API Endpoints

- **Authentication**
  - `POST /api/auth/register` - Register a new user
  - `POST /api/auth/login` - Log in an existing user
  - `POST /api/auth/forgot-password-link` - Send password reset link
  - `POST /api/auth/forgot-password-otp` - Send password reset OTP
  - `POST /api/auth/validate-otp` - Validate OTP
  - `POST /api/auth/reset-password` - Reset password

- **User**
  - `GET /api/users/profile` - Get user profile
  - `PUT /api/users/profile` - Update user information
  - `PUT /api/users/change-password` - Change user password

- **Pets**
  - `GET /api/pets` - Get all pets
  - `GET /api/pets/:id` - Get pet by ID
  - `POST /api/pets` - Create a new pet
  - `PUT /api/pets/:id` - Update pet information
  - `DELETE /api/pets/:id` - Delete a pet

- **Posts**
  - `GET /api/posts` - Get all posts
  - `GET /api/posts/:id` - Get post by ID
  - `POST /api/posts` - Create a new post
  - `PUT /api/posts/:id` - Update post information
  - `DELETE /api/posts/:id` - Delete a post

- **Comments**
  - `POST /api/comments` - Create a new comment
  - `GET /api/comments/:postId` - Get comments for a post
  - `PUT /api/comments/:id` - Update a comment
  - `DELETE /api/comments/:id` - Delete a comment

- **Likes**
  - `POST /api/likes/:postId/like` - Like a post
  - `POST /api/likes/:postId/unlike` - Unlike a post
  - `GET /api/likes/:postId/likes` - Get likes for a post

- **Reports**
  - `POST /api/reports` - Report a post

## License

This project is licensed under the Yallah Nshoof License.