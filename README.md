# Vocabify

## Motivation

I have experience of learning and teaching language and this is an implementation of an idea I have for conveniently, efficiently and enjoyably learning new vocabulary in a natural manner. The key to the concept is that word definitions can be (re)viewed *before* they are read in a text. This approach has advantages over many other applications and learning resources:

- The reader can have a more fluid reading experience - less stopping and starting to look up new words.
- A precompiled list of vocabulary tailored to the user (already levelled content).


## Overview

An application built using the MERN stack where a user can create an account and learn new vocabulary in a target language. The application uses a combination of word frequency lists and a dictionary API in order to provide the definitions of words that the user most likely does not yet know.

The user can submit a text to be analysed and it is returned alongside definitions relevant to the users' level.
New words are suggested to the user on the homepage, words can be saved and accessed later in time and most words in the application are clickable and searchable.

As the user adds or removes words from their saved lists, the application reassesses the users' language level.

## Technologies used

The following technologies were used in this project:

- MERN (MongDB Express React Node.js)
- JSON Web Tokens

## Usage guide

Either navigate to the [live demo](https://vocabify.herokuapp.com/) or clone this repo to run the project locally. Please refer to .env.sample for the format of a .env file for database information.

## Build 

### General
- JWT for authentication.
- Local storage is used to both hold the JWT and for persistence of app state.
- Front-end is bootstrapped using 'create-react-app'.
- React-router for routing (and a 'Protected Route' HOC for redirecting logged out users)


### Tricky/interesting bits/features

#### Backend text analysis

When a text is submitted by the user, backend code analyses the text and returns only definitions that are relevant based on the estimated language level of the user. 
Basic outline of the process: 
- Firstly, the users' vocabulary size is estimated based on the words they have marked as unknown. This bascially just uses a vocabulary frequency list to determine the mean freqency rank of these words.
- Then, each word of the submitted text must be searched for in the word frequency list. If the word is outside of the users' range then it will added to the definitions to be looked up and returned. If a word has previously been flagged as unknown, it will be also be added.
- If any of the above words have already been marked as 'known' by the user, they will not be looked up.
- After all of the relevant definitions have been returned by the dictionay API call, the results are again filtered based on the above criteria (known by user/ inside user vocabulary range) as some of the returned dictionary definitions may not be identical to the requested term (i.e. plurals may return the singular/conjugated verbs may return infinitive). 
- The definitions are returned to the user.

#### Spanner component

A useful React component that wraps every word in some text in a span. I made this to render all definition words clickable (and thus searchable)

#### WordDef component

A reusable and versative (in this app) component used to display word definintions using the 'react-collapisble' package. The component can either accept a definition as props and display it immediately OR it can receive just the word and internally make an API call and search for this word when clicked on. 


## Future features

- I have plans to add suggested reading. This would recommend texts/articles that are close enough to the users' current level for them to be worthwhile reading. (Text difficulty analysis program already written.)

- The app already words well as a mobile application (save as a homescreen widget/favourite) but some improvements can be made.

