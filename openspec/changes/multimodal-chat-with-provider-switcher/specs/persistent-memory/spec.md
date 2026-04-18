# Persistent Memory Capability

## ADDED Requirements

### Requirement: Username prompt on first load

The app MUST prompt the user for a username when no username is found in localStorage, before allowing any chat interaction.

#### Scenario: First-time user

- **Given** no username exists in localStorage
- **When** the app loads
- **Then** a username prompt is shown instead of the chat input
- **And** the user cannot send messages until a username is entered

#### Scenario: Returning user

- **Given** a username is already saved in localStorage
- **When** the app loads
- **Then** the username prompt is skipped and the chat is ready immediately

#### Scenario: User enters a username

- **Given** the username prompt is visible
- **When** the user types a name and confirms
- **Then** the username SHALL be saved to localStorage
- **And** any existing summary for that username is loaded
- **And** the chat input becomes active

### Requirement: Summary injected as context on every request

The app MUST silently inject the user's stored summary as a system message on every chat request so the AI has context from past sessions.

#### Scenario: User with an existing summary sends a message

- **Given** a summary is stored for the current username
- **When** the user sends any message
- **Then** the request to the backend SHALL include the summary as a system message
- **And** the summary is never displayed in the chat UI

#### Scenario: User with no summary yet sends a message

- **Given** no summary exists for the current username
- **When** the user sends a message
- **Then** the request is sent normally with no system message
- **And** the chat works as expected without error

### Requirement: End Session button triggers summary update

The app MUST provide an "End Session" button that, when clicked, sends the current session's messages to the AI to generate an updated summary, then clears the session.

#### Scenario: User ends a session

- **Given** at least one message has been exchanged in the current session
- **When** the user clicks "End Session"
- **Then** the app SHALL call the AI with the current session messages and any existing summary
- **And** the AI returns an updated summary
- **And** the updated summary is saved to localStorage under the current username
- **And** the current session messages are cleared
- **And** the chat window is cleared and ready for a new session

#### Scenario: User ends a session with no messages

- **Given** no messages have been sent in the current session
- **When** the user clicks "End Session"
- **Then** nothing happens (no AI call, no change to stored summary)
