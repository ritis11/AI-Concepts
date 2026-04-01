
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
  

# References : 
- Youtube : https://www.youtube.com/watch?v=RgrHR7xO34Q
  

TO DO:
Solving the Proxy Issues: Learn about "Keep-Alives," disabling buffering, and how headers like X-Accel-Buffering work.

SSE vs. WebSockets: Explore why WebSockets are often considered even "trickier" for L7 load balancers than SSE.

The OSI Model: A quick look at why "Layer 4" load balancing handles SSE much more easily than "Layer 7."
