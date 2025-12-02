# DofusGroup

## Presentation

Hi! I'm Alexandre, a French web developer passionate about creating useful web applications. This repository presents my personal project, built during my training at O'Clock School: DofusGroup, a platform to help [Dofus](https://www.dofus.com/fr) players find teammates more easily. Visit and try it on [Dofusgroup](https://www.dofusgroup.fr).

### Tech Stack

**Frontend:** React, TypeScript, CSS, Nginx  
**Backend:** Node.js, Express, PostgreSQL  
**Containerization:** Docker  
**Tools:** Git, GitHub, Docker Compose, VSCode, ESLint

### Features Overview

- Create and manage your Dofus characters
- Organize and join team events
- Discuss around event with other users
- Public or private event modes
- Event filtering

## Description

### How to run

DofusGroup is a dockerised application, if you need to run it dev mode, you only need docker application. Copy repository on your device, create .env file from .env.example, you need .env files in root, front and back folders. Complete every .env files and run docker compose up --build command from root folder. Application is visible on your localhost at port 8080.

### Problematic

The game [Dofus](https://www.dofus.com/fr) propose many different activities to their players. Many of these activities need to form teams to progress in the game content.

Team building in Dofus is sometimes long, difficult, and frustrating for several reasons:

- No group finder tool integrated
- Many messages in tchat at the same time
- Losing time checking other player characteristics (level, stuff, knowledge, ...)
- No preparation
- Low interest for some of them

All of this slows down player progression and can harm their experience, especially when they can’t find teammates easily. This situation is accentuated if players don't have many playing time. But now DofusGroup is now here to change the game!

### Goal

DofusGroup is here to maximise players time playing. How it does ? You can early create public event in application with date, hour, tag and other informations. You can invite your friend to the event and DofusGroup's users can join the team. This feature increase numbers of possible team player and permit them to win time play. In fact all players know when activity is plan and with who.

## Functionnalities

### User's profile

Every registered DofusGroup user has a user profile. To register new user need to create an account with valid username, mail address and password with dedicated form.This personal profile give access of some functionnalities:

- Manage personnal informations
- Create/manage/delete characters
- Create/manage/join/delete events

### Character's profile

In Dofus each players can have many characters in their account, that's why they can create multiple characters in their profile. Each character's profile reunites many informations as name, level, stuff, server and many others. When user join an event he does with choosing character. Event's author can see character's informations to help him define if he is a well mate for the event.

### Events

All registered users can create events with dedicated forms. As character's profile, each event will have his own property as title, tag, type, date and others. This information will help users to find relevant event in list with sorting tool. By default every event's are public, but you can also set it private. Private events not appear in the main list, you can share URL link with your friends, and permits them join the team.

### Next steps

- Implement account validation by email
- Implement forgot password update by email
- Deep team management with new team mate integration validation by event owner
- Implement visual elements from DofusBook if character's stuff is filled
- Monetize app with advertisement banners
