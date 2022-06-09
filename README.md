# privacy-code-tools
Some helper tools to avoid using a spreadsheet

## Setup and deployment instructions

There are still a lot of hardcoded hacks in the deploy process.
  - [] Fix that.

you need to install:
  - `fish` shell
  - `npm`
  - `aws` and `eb` cli tools.

run:
  - `eb init`
  - `npm install`

to deploy new code:
  - `deploy.fish`

follow the instructions on [setting up the environment variables](env_variables.md)


## Basic Structure

Most of the application resides in the `frontend/src` directory. 

 - `/coder` The base Django application
   - `api` - a Django app containing backend code, comprising a model around a postgres database and some coarse validation logic
   - `frontend` - a Django app containing the frontend code. The meat of the application lives here.
     - `frontend/src` - a JSX/React application the renders the UI and contains way too much application logic.

### Backend

The basic model involves:
  - *policy* - the atomistic unit to be coded. For example, an organization's privacy policy for a given jurisdiction.
  - *policy instance* - a snapshot of the set of documents comprising a _policy_ at a specific point in time. For example, the July 2021 version of an orgianization's policy for a given jurisdiction.
  - *coding* - a list of multiple-choice questions to ask about a _policy instance_.
  - *coding instance* - a coder's answers to the coding questions for a specific _policy instance_

We also include some logging tables:
  - *Raw Policy Instance* - a snapshot of the raw HTML of a policy instance. The coded policy instances are converted into a standard format resembling markdown.
  - *Timing Session* - a log of the time spent coding a policy instance, with question-level detail and attention tracking.

And some project management stuff:
  - *Assignment* - an assignment for a coder. Typically a policy to code.
  - *Assignment Type* - an artifact of a grand design not realized.
  - *Project* - a high-level container to keep coding projects separate from each other.

`api/models.py` should be a relatively direct translation of these definitions to code. It uses the [Django REST framework](https://www.django-rest-framework.org/api-guide/) and is structured to roughly follow the [Django REST framework's convention](https://www.django-rest-framework.org/api-guide/conneg/). It's not complex enough to get beyond what is covered in the introduction section of the documentation.

### Frontend

The frontend application is a [React/Redux application](https://redux.js.org/introduction/getting-started). 

The core concept of Redux is a careful separation of rendering and state modification logic. 
 - `component`s are responsible for rendering UI, given a state. The only thing a component can do is call an `action`.
 - `reducer`s takes the current state and and `action` and return a new state.
 - `action`s encode user inputs and external data into a standard format which they pass to the reducer. They can be triggered by API responses, user actions, or timers. 
**note:** I break the standard Redux model and allow actions to shoot off API calls.


If you install [redux toolkit](https://redux-toolkit.js.org/) in your browser, you can rewind, replay, and edit actions in the browser during testing and development.