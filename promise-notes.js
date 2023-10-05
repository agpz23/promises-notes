//Promises notes

/*Promises are the foundation of asynchronous programming in modern JS.

Promise is an object returned by an asynchronous function which represents the current state of operation.

When promise returned to caller the operation isn't finished most times.

Prerequisites: 
- Basic computer literacy
- Reasonable understanding of JS fundamentals
- Includes event handling 

Objective:
- understand how to use promises in JS

A promise-based API, the asynchronous function starts at the operation and returns a Promise object/

Handlers can be attached to the promise object and handlers can be executed when the operation has succeeded or failed
*/


/* Using the fetch() API

- Make an HTTP request to the server, this sends a request message to a remote server and a response is sent back
-  A request is sent to get a JSON file from the server
*/


// Example:
// We call the fetch() API and assign the return value to the fetchPromise variable
// After logging the fetchPromise variable, output should be Promise { <state>: "pending"}, telling use we have a Promise object with a state whose value is pending


const fetchPromise = fetch(
    "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",

);

console.log(fetchPromise);

fetchPromise.then((reponse)    => {
    console.log('Received response: ${response.status}');

});

console.log("Started request");









/* Chaining promises

With the fetch() API, once you get a Response obehct you need to call another function to get the response data

We want the response to be a JSON file so we call the json() method of the Response object

json() is also asynchronous
*/


//  Example: we have to call two successive asynchronous functions

const fetchPromises = fetch(
    "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
);

fetchPromise.then((reponse)  => {
    const jsonPromise = response.json();
    jsonPromise.then((data)  => {
        console.log(data[0].name);
    });
});


// Example 2:
// Instead of calling the second then() inside the handler for the first then(), we can return the promise returned by json()
// Promise chaining means we can avoid ever-increasing levels of indentation when consecutive asynch function calls are needed

const fetchPromise = fetch (
    "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
);

fetchPromise
.then((response) => response.json())
.then((data)  => {
    console.log(data[0].name);
});

// Example 3:


const fetchPromise = fetch (
    "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",

);

fetchPromise
.then((response)  => {
    if (!response.ok) {
        throw new Error('HTTP error: ${response.status}');
    }
    return.response.json();
})
.then((data)  => {
    console.log(data[0].name);
});


/* Catching errors
- fetch() API can throw an error for many reasons 
- in order to support error handling, Promise objects provide a catch() method which is a lot like the then() method
- Handler passed to then() is called when asynchronous operation succeeds, the handler passed to catch() is called when the asynchronous operation fails
- Adding catch() to the end of a promise chain then it will be called when any of the asynchronous function calls fail
- Can implement an operation as several consecutive asynchronous function calls and have a single place to handle all errors
*/

// Example:


const fetchPromise = fetch(
  "bad-scheme://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
);

fetchPromise
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log(data[0].name);
  })
  .catch((error) => {
    console.error(`Could not get products: ${error}`);
  });


  /* Promise terminology:
 - pending: promise has been created and the asynch function it is associated with has not succeeded or failed yet
 - pending is the state your promise is in when it's returned from a call to fetch() and the request is still being made
 - fulfilled: the asynch function has succeeded when a promise is fulfilled, its then() handler is called
- rejected: the asynch function has failed. A promise is rejected then its catch() handler is called
- A fetch() request is successful if the server returned an error like 404 Not Found but not if a network error prevents the request being sent
  */



/* Combining multiple promises
- Promise chain is what you need when operation consists of several asynch functions and you need each one to complete before starting the next
- When you want all promises fulfilled but they don't depend on each other, it is efficient to start them all off together then be notified when they have all fulfilled
- The Promise.all() method is what you need, it takes an array of promises and returns a single promise 
- Promise returned by Promise.all() is
        - fulfulled when and if all promises in the array are fulfilled
        - the then() handler is called with an array of all the responses in the same order that the promises were passed into all()
        - rejected when and if any of the promises in the array are rejected */


        const fetchPromise1 = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
);
const fetchPromise2 = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/not-found",
);
const fetchPromise3 = fetch(
  "https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json",
);


// Example
// This could makes three fetch() requests to three different URLs and if they all succeed they will lof the response status of each
Promise.all([fetchPromise1, fetchPromise2, fetchPromise3])
  .then((responses) => {
    for (const response of responses) {
      console.log(`${response.url}: ${response.status}`);
    }
  })
  .catch((error) => {
    console.error(`Failed to fetch: ${error}`);
  });


// Example code with badly formed URL

const fetchPromise1 = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
);
const fetchPromise2 = fetch(
  "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/not-found",
);
const fetchPromise3 = fetch(
  "bad-scheme://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json",
);

Promise.all([fetchPromise1, fetchPromise2, fetchPromise3])
  .then((responses) => {
    for (const response of responses) {
      console.log(`${response.url}: ${response.status}`);
    }
  })
  .catch((error) => {
    console.error(`Failed to fetch: ${error}`);
  });





  /* asynch and wait
- asynch keyword gives you a simpler way to work with asynchronous promise-based code
- await keyword can be used before a call to a function that returns a promise
- this makes the code wait at that point until the promise is settled at which point the fulfilled value of the promise is treated as a return value
  */

// Example calls the await fetch() and instead of getting a promise, our caller gets back a fully complete response object just like fetch() if it was a synchronous function
// can even use a try....catch block for error handling
async function fetchProducts() {
  try {
    // after this line, our function will wait for the `fetch()` call to be settled
    // the `fetch()` call will either return a Response or throw an error
    const response = await fetch(
      "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    // after this line, our function will wait for the `response.json()` call to be settled
    // the `response.json()` call will either return the parsed JSON object or throw an error
    const data = await response.json();
    console.log(data[0].name);
  } catch (error) {
    console.error(`Could not get products: ${error}`);
  }
}

fetchProducts();


// Example 2

async function fetchProducts() {
  try {
    const response = await fetch(
      "https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json",
    );
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Could not get products: ${error}`);
  }
}

const promise = fetchProducts();
promise.then((data) => console.log(data[0].name));




/* Conclusion
- promises are the foundation of asynchronous programming in modern JS
- makes it easier to express and reason about sequences of asynchronous operations without deeply nested callbacks
- async and await keywords make it easier to build an operation from a serious of consecutive asynchronous function calls
*/