# Room Challenge

This is an assessment project which is purely an API-based application.

Assumptions:

1. The mobile_token is used as an authentication token in conjuction with a header called x-access-token
2. 'signed in as a user' and 'signed in as a user' are assumed to be the same
3. The mobile_token is used as a JWT in this assessment but no actual verification occurs on the JWT for the moment just uses the password as the secret to encode the JWT
4. No expiration of JWT
5. No logout routes added


What is not included:

1. Unit Tests
2. Persistence does not exist and this has affected the structure of the application
3. Splitting of the routes into separate files could have been done
4. Hashing of passwords upon retrieval from some routes

---
## Requirements

For development, you will only need Node.js and a node global package, installed in your environement.

### Node
- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

###
## Configuration

The application uses dotenv and has a single .env file with the PORT setting.
To change the port value, modify the .env file


## Install

    $ git clone https://github.com/jpretorius767/room-challenge.git
    $ cd room-challenge
    $ npm install

## Running the project

    $ npm run start

