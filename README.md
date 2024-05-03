# Welcome to LinguaSync

Welcome to the GitHub repository for LinguaLink, an AI-driven language literacy application designed to transform the way users engage with new languages through conversation. This README provides all the necessary information to get started with the project, including setting up your environment, and running the application.

### Table of Contents

1. [Project Overview](https://github.com/linguasync/linguasync_prototype/edit/main/README.md#project-overview)
2. [Getting Started](https://github.com/linguasync/linguasync_prototype/edit/main/README.md#getting-started)
   - [Prerequisites](https://github.com/linguasync/linguasync_prototype/edit/main/README.md#prerequisites)
   - [Installation](https://github.com/linguasync/linguasync_prototype/edit/main/README.md#installation)
3. [Usage](https://github.com/linguasync/linguasync_prototype/edit/main/README.md#usage)
4. [Features](https://github.com/linguasync/linguasync_prototype/edit/main/README.md#features)
5. [Technology Stack](https://github.com/linguasync/linguasync_prototype/edit/main/README.md#technology-stack)
6. [Contact](https://github.com/linguasync/linguasync_prototype/edit/main/README.md#contact)

## Project Overview

LinguaLink leverages [Google's Vertex AI](https://cloud.google.com/vertex-ai/docs), along with advanced speech-to-text, text-to-speech, and translation technologies, to create a real-time, interactive language learning experience. Users can practice and improve their language skills through AI-driven conversations that are both engaging and instructive.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later)
- npm (v9 or later)


### Installation

1. Clone the repository:
```
git clone https://github.com/linguasyncinc/Linguasync_prototype.git
cd Linguasync
```
2. Install dependencies:
```
npm install
```
3. Set up environment variables:
   - Copy the .env file to a new file named .env.
   - Fill in the necessary API keys and authentication credentials.
4. Start the development server:
```
Copy code
npm run dev
```
or you might want to run a build using `npm run build` then start the development server using `npm run start`

## Usage

After installation, you can start using LinguaSync by navigating to `localhost:3000` on your web browser. Here you can test out language learning sessions.

`localhost:3000/transcribe` takes to the page where you record your speech and generate the text format provided you are in a quiet environement and you have given the necessary microphone access permissions.

`localhost:3000/translate` navigates you to the page where you type in texts and generate the translation in the language of your choice from our drop down select menu. And also, you can convert the translation to an audio format which can help shape your pronounciation.

## Features

- **Real-Time Conversation Practice**: Engage with an AI-driven partner that responds intelligently in your target language.
- **Speech Recognition**: Convert spoken language to text to practice pronunciation and fluency.
- **Translation and Transcription**: Get real-time feedback with translations to ensure understanding.

## Technology Stack

- **Frontend**: Nextjs
- **Backend**: Nextjs serverless function
- **AI**: [Google's Vertex AI](https://cloud.google.com/vertex-ai/docs), [Google Cloud Speech-to-Text API](https://cloud.google.com/speech-to-text/docs), [Google Cloud Text-to-Speech API](https://cloud.google.com/text-to-speech/docs), [Google Cloud Translation API](https://cloud.google.com/translate/docs/reference/api-overview)


## Contact

For any queries, please reach out to us at linguasyncinc@gmail.com.

## Deployment
The app was deployed on vercel @ `https://linguasync-prototype.vercel.app`


## ENJOY!!! and don't forget to star the project
