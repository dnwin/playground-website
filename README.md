Playground Web Server
=================
* OS: ScotchBox Ubuntu Server using Vagrant (box.scotch.io)
* Installed: LAMP Stack, Node, express-generator, npm, nodemon, gulp, grunt, yeoman, mongodb, postgresql


#### [Apache Static Folder](/public/)
* Folder to the LAMP server on port 80.

---

### Node.js

#### [/nodejs/chatrooms](/nodejs/chatrooms/)
* Chatroom application using node.js and socket.io
* Users can join rooms, have unique nicknames.  

#### [mysql_rest_module](/nodejs/examples/mysql_module)
* CRUD page using a mysql REST module.

#### [basic_restful_api](/nodejs/examples/restful_api)
* Demonstrates a basic REST Api using ```express``` and ```body-parser```

#### [multithreading with clusters](/nodejs/examples/clusters)
* Cluster module forking

#### [template_replace](/nodejs/examples/template_replace/)
* Displays an html file and replaces % with data from a json file.

#### [serial_flow_control](/nodejs/examples/serial_flow_control)
* Output titles and URLS from a RSS feed. Demonstrates serial control using ```next(err, param)```

#### [parallel_flow_control](/nodejs/examples/parallel_flow_control)
* Counts word count after all text files are counted. Demonstrates serial flow control using ```checkIfComplete()```

#### [middleware](/nodejs/examples/middleware)
* Examples of logger, error, authentication middleware using connect.

#### [simple cli](/nodejs/examples/storage/1)
* Command line script to add and list tasks. Saves to a file in the current working directory.
