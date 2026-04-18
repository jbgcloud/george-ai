# Image Input Capability

## ADDED Requirements

### Requirement: Paste image into chat input

The app MUST allow users to paste an image from the clipboard into the chat input area and display a thumbnail preview before sending.

#### Scenario: User pastes a screenshot

- **Given** the user copies an image (e.g. a math problem screenshot) to their clipboard
- **When** they paste (Ctrl+V) into the chat input
- **Then** a thumbnail preview of the image appears above the textarea
- **And** the Send button remains enabled

#### Scenario: User pastes text (no regression)

- **Given** the user copies plain text to their clipboard
- **When** they paste into the chat input
- **Then** the text appears in the textarea as normal with no image preview shown

### Requirement: Send message with image

The app MUST send both the pasted image and any accompanying text to the AI when the user submits the message.

#### Scenario: User sends image-only message

- **Given** a pasted image preview is visible and the textarea is empty
- **When** the user clicks Send or presses Enter
- **Then** the image is sent to the backend
- **And** the AI responds describing or analyzing the image

#### Scenario: User sends image + text

- **Given** a pasted image preview is visible and the textarea contains text (e.g. "solve this")
- **When** the user clicks Send
- **Then** both the image and text SHALL be sent together
- **And** the AI responds to the combined input

### Requirement: Clear pasted image

The app MUST provide a way for users to remove a pasted image before sending.

#### Scenario: User removes image before sending

- **Given** an image preview is visible
- **When** the user clicks the × button on the preview
- **Then** the image SHALL be removed and the textarea returns to normal input mode
