# HEEEEEEEY, VISITOR!!!

Firstly it was a pleasure to spend time on this challenge, I really loved each line of code of this project. The goal of the project motivated me a lot! I'm gonna start this tiny documentation speaking of each requirement of this system. I will comment on how I developed this component on my app.

I separated this document in 3 blocks: 

1. [Observation of Requirements](https://github.com/ThalesGabriel/Pure-web-strAPI/new/develop?readme=1#requirements)
2. [How to run the app](https://github.com/ThalesGabriel/Pure-web-strAPI/new/develop?readme=1#-yeah-yeah-yeah-you-talked-a-lot-but-how-do-i-test-this-app-)
3. [Bonus!](https://github.com/ThalesGabriel/Pure-web-strAPI/blob/develop/README.md#bonus)

## Requirements

- [x] Develop an API that returns the file count, the total number of lines and the total number of bytes grouped by file extension, of a given public Github repository. As in the example below:

```
[
  {
    "extension": "java",
    "count": 4,
    "lines": 360,
    "bytes": 5246
  },
  {
    "extension": "xml",
    "count": 2,
    "lines": 45,
    "bytes": 368
  },
  …
]
```

- [x] Your API must be written using Java 8 or newer, ECMAscript 2015 or newer, or C# 8.0;
- [x] Data must be retrieved from Github website by using web scraping techniques. Do not use Github’s API or download the source code as a ZIP file;
- [x] Do not use web scraping libraries. We would like to know your ideas on how it can be done;

OBS: Nice! At this moment I was really curious about how I would do that, how to do pure web scrap. At that moment I had a lot of work to do and as a bonus, I was on the final of the sprint on my current work so every free time that I had, I used to develop this part.
### To build an API RESTful I used something that I'm very used to work which is NodeJS and GraphQL, represented by graphph-yoga. In short, It is a fully-featured GraphQL Server with focus on easy setup, performance & great developer experience.
### I used mongoose to quickly return data already fetched.
### I used RamdaJs to help me to work with the data that we want return

#### "> Holy s@#$! So you didn't used express?"
![text](https://i.pinimg.com/originals/96/11/d2/9611d2fde013a9a5fca0d2766b44d09a.jpg "Young padawan")

#### I almost did that but I was not worried about express because I had a short deadline and my job was not giving me much time to spend on that, so I had to focus all my attention on developing the logic behind the scenes.
"> Nice, got it. But how do you build all web scrap stuff?"

I developed 2 approaches: 

> The dumb one: I used to quickly finish this step but it was extremely unworthy. 

- After making sure it was a valid URL I used `node-fetch` library to make requests to the github repository. My goal here was to get the content of the page in text mode, so I could use regex to search for the link tags that was representing the files and folders

- If it was a folder I recursively used `node-fetch` again in the href of the tag to get all documents inside of that folder

#### I said it was a dumb one...

> The least dumb one: When you enter in a git repository you see a button called `Go to file`. This button gets all files that you have in the given repository.

- That is the approach I am using now. But I couldn't use `node-fetch` again because this lib does not wait for events, It just gets content and returns. That was a problem because the page that the `Go to file` button takes us to is a page that initially has an empty state and then loads the documents from the repository

- To get around this technical debt I counted on the help of the puppeteer. In short, It is a library that could help me to await the page loads then get the result, i.e. the content with all links that goes to a file of that repository.
- The coolest thing is that puppeteer does not need regex, I could just put the class that I was expecting to get invisible to get my content. Basically, when the h3.mb-1 tag, `No results found`, gets invisible I return the content.

### 🎉 THAT WAS AWESOME BECAUSE THE REPOSITORY THAT LOADS ABOUT A MINUTE TO RETURN SOMETHING, SOMETIMES AN ERROR, NOW WITHOUT ERRORS IT WAS RETURNING IN 10 SECONDS. 🎉

- [x] Your API must support thousands of concurrent requests;

- I used NGIX to act like a load balancer then in K8s I could do something better to support that.
- To make sure everything works well and impress you guys I would use Fortio which is a tool that would help me do some stress tests so I would tell you with 100% certainty how much this API can handle. Unfortunately, I have not so much experience in K8s so I couldn't do that in the time that I had :(
- To ensure Observability I would take the wave of Istio because of the fortio and implement the Istio itself so that we could see the flow of the application. Unfortunately, I have not so much experience in K8s so I couldn't do that in the time that I had :(

- [x] We think it’s ok if the first request to a particular repository takes some time to respond (since you depend on Github website response times), but we don’t expect the subsequent requests to be long;

- I ensured this by using mongoose.

- [x] We don’t expect to get timeout errors;

- From what I tested I didn't get any timeout errors.

- [x] We must understand your code and use your API without having to ask you any questions. Our primary language is English so please use it on comments and documentation;
- [x] We’d like to see SOLID principles in your solution;

- I gave my best to implement with the time that I had (I am not talking about the time that you guys gave me but the time that I really could use to implement this API)

- [x] You are free to choose your API contracts (parameters and response formats) but we’d like to be able to integrate it with any other existing solutions;

- We gonna talk about that later in the next section

- [x] We’d like to see at least one automated test;

- To accomplish that I used Jest to help me to write 3 tiny tests about the creations of entities with mongoose.

![text](https://raw.githubusercontent.com/ThalesGabriel/Pure-web-strAPI/develop/public/tests.png "Tests")

- [ ] You must deploy your solution to a cloud provider like Amazon AWS or Heroku and send us the link to access it. It’s a plus if you publish a Docker image with your application (including its dependencies) in a registry like Docker Hub and let us know how to get it.

- [x] Docker image: I based all of the project on docker images so if you enter `docker-compose.yml` you would see some services, pay attention at 2 `api` and `nginx-api` you gonna find there are the docker images

- [ ] Cloud After the part I mentioned that I couldn't do with K8s, Istio and Fortio, I would deploy to AWS, but the time is up, I really couldn't try or I wouldn't have time to write this document.

## 🔥 Yeah, yeah, yeah, you talked a lot but how do I test this app? 🔥

#### First things first

1. Clone this repo

```
git clone https://github.com/ThalesGabriel/Pure-web-strAPI.git
```

2. Make sure you are in branch develop

```
git checkout develop
```

2.1. Create a `.env` file in root of `api` folder

- There is a `.env.sample`. Use the first code block on this file.

3. Start the application

```
docker-compose up -d --build
```

4. Check containers

```
docker ps
```

![text](https://raw.githubusercontent.com/ThalesGabriel/Pure-web-strAPI/develop/public/containers.png "Containers")

4.1. Obs. Give a look on the image sizes

```
docker images
```

![text](https://raw.githubusercontent.com/ThalesGabriel/Pure-web-strAPI/develop/public/images.png "Images")

> Something I wanted to do but didn't have time was the multi staging build to decrease the size of the application. I managed to reduce the size to 950mb as in the image below but I couldn't connect the dots quickly to get everything working and I had to move on.

![text](https://raw.githubusercontent.com/ThalesGabriel/Pure-web-strAPI/develop/public/api-size-msb.png "Image MSB")

5. Open the browser in `http://localhost:8000` which is hosted by NGIX service pointing to our API in `http://app:4444`. They are sharing the same network, you gonna see something like that:

![text](https://raw.githubusercontent.com/ThalesGabriel/Pure-web-strAPI/develop/public/playground.png "Playground")

6. Make you first request

- The first request you have to do is the mutation of:

```
mutation createInfoRepository($url: String!) {
  createInfoRepository(url: $url)
}
```
- As query variables you could put something like:
```
{
  "url": "ThalesGabriel/semana-omnistack11"
}
```

- You would receive as response something like in the image above, basically the link of the repository found

7. Now you are ready do get info of the repository using the query below

```
query getInfoFromRepository($url: String!){
  getInfoFromRepository(url:$url) {
    id
    name
    user
    data
  }
}
```

- You should pass the same URL that you used in the mutation if you want to see your data else you will receive a response like `This repository does not exist on our data`

- If you input the same repository on the creation of info you gonna receive something like that:

![text](https://raw.githubusercontent.com/ThalesGabriel/Pure-web-strAPI/develop/public/return.png "Successful")

### Bonus 

- You must have noticed that there is an `app` service on our `docker-compose.yml`. Basically I was doing a simple application with the same function of GraphQL Playground. The frontend app was made in NextJS, Apollo GraphQL, Material UI, Formik and Yup for forms and validations. It works locally but I could not complete the development in containers: 

![text](https://raw.githubusercontent.com/ThalesGabriel/Pure-web-strAPI/develop/public/app.png "App")

- To put some quality and play with my development I used `Github actions` to play with `CI` and to help me to test application to see if something would break something and what comes to be a simple play helped me a lot, mainly because of the time I had left, if I had merged something wrong I might not be able to have the patience to fix it anymore.

- I already put some integration with Sonarcloud to see some stats but I do not improved that, I have many bugs to solve rs.


## That's all folks 🎉

- As I said, I loved the challenge and the mindset that it brought to me. I don't have that experience with these tools, other than the API with GraphQL, but I did the best I could. Despite not having achieved all the results expected by you, I loved how much I was able to learn during the development of this application. 

# Thank you for the opportunity to participate in this selection process!!
