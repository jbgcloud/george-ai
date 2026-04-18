# Provider Switcher Capability

## ADDED Requirements

### Requirement: Provider settings panel

The app MUST provide a settings panel where users can choose an AI provider, enter their API key, and select a model.

#### Scenario: User opens settings

- **Given** the app is loaded
- **When** the user clicks the settings icon in the header
- **Then** a settings panel opens showing provider options: Groq, Anthropic (Claude), OpenAI

#### Scenario: User selects a provider

- **Given** the settings panel is open
- **When** the user selects "Anthropic (Claude)"
- **Then** an API key input field appears for that provider
- **And** a model selector shows available models for that provider

#### Scenario: User saves settings

- **Given** the user has selected a provider and entered an API key
- **When** they click Save
- **Then** the settings SHALL be saved to localStorage
- **And** subsequent chat messages use the selected provider

### Requirement: Backend dynamic provider routing

The backend MUST route requests to the correct AI SDK based on the provider specified by the client request.

#### Scenario: Request with Groq provider

- **Given** the client sends provider "groq" with a model and API key
- **When** the backend receives the /chat request
- **Then** the Groq SDK SHALL be used to complete the request

#### Scenario: Request with Anthropic provider

- **Given** the client sends provider "anthropic" with a model and API key
- **When** the backend receives the /chat request
- **Then** the Anthropic SDK SHALL be used to complete the request

#### Scenario: Request with OpenAI provider

- **Given** the client sends provider "openai" with a model and API key
- **When** the backend receives the /chat request
- **Then** the OpenAI SDK SHALL be used to complete the request

### Requirement: Default provider requires no user setup

The app MUST work out of the box using Groq with the server-side API key, so first-time users do not need to configure anything.

#### Scenario: First-time user with no settings saved

- **Given** no provider settings are in localStorage
- **When** the user sends a message
- **Then** the request SHALL use Groq with the server-side GROQ_API_KEY from .env
- **And** the app works without the user entering any API key

#### Scenario: Vision model auto-selected when image is attached

- **Given** the user pastes an image and the active provider is Groq
- **When** the message is sent
- **Then** the model MUST be automatically set to llama-3.2-90b-vision-preview
- **And** the image SHALL be included in the request payload
