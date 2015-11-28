Playground LAMP/Node.js/Express Server
=================
* Linux web server used for local testing.
* OS: Ubuntu LAMP stack with Node.js/Express installed using Vagrant (box.scotch.io)


####` [/public](/public/)
* Folder to the LAMP server on port 80.

#### [/nodejs/chatrooms](/nodejs/chatrooms/)
* Chatroom application using node.js and socket.io
* Users can join rooms, have unique nicknames.

#### [basic_restful_api](/nodejs/examples/restful_api)
* Demonstrates a basic REST Api using ```express``` and ```body-parser```

#### [template_replace](/nodejs/examples/template_replace/)
* Displays an html file and replaces % with data from a json file.

#### [serial_flow_control](/nodejs/examples/serial_flow_control)
* Output titles and URLS from a RSS feed. Demonstrates serial control using ```next(err, param)```

#### [parallel_flow_control](/nodejs/examples/parallel_flow_control)
* Counts word count after all text files are counted. Demonstrates serial flow control using ```checkIfComplete()```

#### [middleware](/nodejs/examples/middleware)
* Examples of logger, error, authentication middleware using connect.

#### [simple cli](/nodejs/examples/storage/cli_tasks.js)
* Command line script to add and list tasks. Saves to a file in the current working directory.
