
## HTTP
HTTP defines a standard request protocol (communication mechanism) - meaning that client making a request to the server over web, using a particular format (method, URL, headers, and optional-body) of request body and server serving the resources
- each request is stateless
-  messages are in plain text
-  Client-Server Architecture of Requesting and Serving Resources
-  methods of HTTP:
    - GET receives data without modifying the resource
    - POST submits data for processing or resource creation
    - PUT creates or replaces a resource completely
    - DELETE removes a resource from the server
    - HEAD receives response headers only, etc.
- The following information is present in the request and response parts:
 
    - HTTP Request Headers : As the head represents a person, in the HTTP request, the headers are key-value pairs sent that provide **client details**, preferences and request metadata.
    - HTTP Request Body	: Contains data sent to the server, such as form data, **credentials**, or payload content.
    - HTTP Response	: Server’s reply to a request, including status code, headers, and an optional body.
      - HTTP Status Codes	: Three-digit codes indicating request results (1xx informational, 2xx success, 3xx redirection, 4xx client error, 5xx server error).
      - HTTP Response Headers	: Metadata describing the response, such as **content type**, language, and encoding.
      - HTTP Response Body	: **Actual content** returned by the server, such as HTML, JSON, images, or other data.
Trivia :  HTTP 0.9 was the initial version introduced in 1991 |  version 1.1 was followed in 1996 | version 1.1 was introduced in 1997 | 2.0 was in 2015 | version 3 was introduced in **2022** based on a QUIC protocol 
     
## Long Polling
Client makes an HTTP request to the server and the server keeps the request open untill it has new data or time out occurs. 
Usage : Monitoring systems, data sync
<img width="644" height="640" alt="image" src="https://github.com/user-attachments/assets/07d7ff8a-af57-4d97-b51e-842ff7542119" />

## TCP
HTTP is creating those payloads, after that it has to be transferred over the web to the server in the form of small packets in sequence. 
This is where TCP comes in. Once the server starts receiving, it has to acknowledge after each packet is received. But how would it know what is the sequence of packet?
For server to sort all the packets in order and process it, the server and client have to agree on the sequencing of packets. 
Hence we need 3-way TCP Handshake. In this Handshake,
1. the client sends a number which is the start of the order of its packets id (e.g. 14001). 
2. The server recieves it and acknowledges that the client's packet's ID is going to begin from 14001. Along with the acknowledgement, the server also sends the first packet ID of responses that it is going to send,
3. which is then ack by the client. 
With this step the  handshake is complete. 
After this handshake, the client send data packets in seq, and server sends ack. As soon as client recieves ack, it clears that packet from its sending queue.  if no acknowledgement is received from the server, then after some time the client re-attempts to send that packet. 
**Once all the packets are received, the TCP protocol arranges them in a correct order**
for closing the connection, again a three-way handshake happens.
1. The client sends a FIN request
2. Te server acknowledges and sends its own FIN request telling the client that it is ready to close the connection.
3. The client acknowledges the server's FIN request, and hence the connection is closed.

## UDP
- UDP is not connection oriented (no handshakes - no official start or end to the connection - no ack, hence no confirmation of data delivery | no error awareness)
- Assumption : Any package that contains same source ip, source code, destination ip, destination code, protocol and arrives between the same time -- belongs to the same UDP connection
- It is optimised only for speed which is requried in media datatype deliveries like video/audio streaming

### Source : https://www.youtube.com/watch?v=jE_FcgpQ7Co



## Blocking HTTP APIs 

<img width="798" height="266" alt="image" src="https://github.com/user-attachments/assets/10e59547-d95e-4975-804e-945a89c38bfd" />

- Traditional API where the user sends the request prompt to a backend server (lets say FAST API), and the backend server requests using OpenAIClient to LLMs
- This request will be completed when OpenAI responds and the backend server receives it and sends it back to the user client. 

## Asychronous HTTP APIs

<img width="802" height="432" alt="image" src="https://github.com/user-attachments/assets/4a782daa-5ffb-40fb-a7cf-fce2e7728535" />

- In this case, when the backend server receives the request and forwards it to OpenAI, it attaches a task ID to the request with OpenAI. While it is waiting for the response to be received, it sends a polling URL with task_id to the user client.
- The user client can then use that polling URL to check the status of the response using that task ID that is given to it.
- User can do other things while processing is happening, we arent blocking the call. 

## HTTP Streams

<img width="805" height="705" alt="image" src="https://github.com/user-attachments/assets/a1889b96-a07e-4be8-8077-e0c9f59853c7" />

- Here the backend forward the chunks of responses that we get from OpenAI to our client.
-  Important: Here, once a user fires a GET request with the user query, and the backend is streaming the response that it gets from OpenAI back to the user client,
  the user cannot send another GET request in between. The process has to complete. All the chunks have to be sent back to the user client before any other GET request is sent.
-  To improve this design, we either use web sockets or we expose another endpoint, such as interrupt, using which the client can stop the response.
- Using the interrupt, we just stop the streaming response from a backend service
  

### References : 
- Youtube : https://www.youtube.com/watch?v=RgrHR7xO34Q
  





