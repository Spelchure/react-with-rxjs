# Using RxJS with React

RxJS is the library that allows us to implement reactive programming. The **subject** logic offered by RxJS can be used for communication between components in React. In a way, this use of the RxJS library replaces the state management libraries and React's Context API.

![React & RxJS](./Cover.png)

- 1. [What is RxJS](#WhatisRxJS)
  - 1.1. [**Terms of RxJS**](#TermsofRxJS)
- 2. [Creating Project and Installing RxJS](#CreatingProjectandInstallingRxJS)
  - 2.1. [**Creating Project**](#CreatingProject)
  - 2.2. [**Installing RxJS**](#InstallingRxJS)
  - 2.3. [**Building Folder Structure**](#BuildingFolderStructure)
- 3. [Creating RxJS Subject](#CreatingRxJSSubject)
- 4. [Creating Communication Components](#CreatingCommunicationComponents)
- 5. [Cloning This Repo & Installing](#CloningThisRepoInstalling)

## 1. <a name='WhatisRxJS'></a>What is RxJS

RxJS is a library that allows us to develop reactive applications with Javascript. It has applications in many languages. Reactive programming is a programming paradigm based on data streams, monitoring and propagation of data change. Reactive programming is generally used in event-driven and asynchronous applications. In reactive applications, there are units that broadcast and listen to the data. These are called observables and observers. The observer subscribes to the observable and they are alerted by the observable on any change. In simple terms, observable units can be thought of as components that stream data, observers can be thought of as components that listen to this data stream.

### 1.1. <a name='TermsofRxJS'></a>**Terms of RxJS**

- **Observable**: Observable component.
- **Observer**: The observing unit that subscribes to the observable component.
- **Subject**: A kind of observer that streams data to more than one observing component. (multicasting)
- **Subscription**: The process of subscribing to Observer components can be thought of as running observable components.
- **Operators**: These are pure functions that allow republishing the data stream by modifying, changing the data stream presented by the Observer.
- **Schedulers**: They are used to control concurrency. For example, delaying a data stream.

The important point to note here is that when any observable subscribes to it, the observable works separately for each subscriber observer. If two observers subscribe to the observable at the same time, they are unaffected by each other. Observable components do not work without any observer subscribing.

Subjects, on the other hand, can stream data without any observer subscribing to it, and observers can miss the previously broadcast data stream. Observers only receive the data stream after subscribing. Subjects publish data independently of observers. In this respect, the subjects can be compared to concerts, whether you go or not, the concert continues and you can realize what happened after you go.

For detailed information about RxJS: _[RxJS](https://rxjs.dev/)_

For detailed information about reactive programming: _[What is Reactive programming ?](https://medium.com/@kevalpatel2106/what-is-reactive-programming-da37c1611382)_

## 2. <a name='CreatingProjectandInstallingRxJS'></a>Creating Project and Installing RxJS

In the sample project, two components communicate with the subject logic provided by RxJS. The component containing the input transfers the data over the subject to the other component every time the input changes. The other component monitors this data on the subject and updates the state object when there is a change. In the sample project, typescript is used as the language. It works stably with RxJS typescript.

### 2.1. <a name='CreatingProject'></a>**Creating Project**

The project is first created with create-react-app using yarn or npx:

```sh
npx create-react-app react-with-rxjs --template typescript
yarn create react-app react-with-rxjs --template typescript
```

### 2.2. <a name='InstallingRxJS'></a>**Installing RxJS**

Adding RxJS to the project using NPM or Yarn:

```sh
npm install rxjs
yarn add rxjs
```

### 2.3. <a name='BuildingFolderStructure'></a>**Building Folder Structure**

The directory structure of the project is set up as follows:

```
./react-with-rxjs
|  |-- Contexts/
|  |-- Components/
|  |-- package.json
```

In this directory structure, we have our React components that do the communication in the `Components/` folder, and the React context that creates the RxJS subject and presents the subject to all components under `Context/`. For detailed information about contexts: _[React Context API](https://reactjs.org/docs/context.html)_

## 3. <a name='CreatingRxJSSubject'></a>Creating RxJS Subject

The RxJS object is created by a _context_ in our application and presented to the entire application. For this, into the `AppContext.tsx` file in the `Contexts/` directory:

```tsx
import React, { createContext } from "react";
import { Subject } from "rxjs";

export interface IAppContext {
  service: Subject<string>;
}

const initialState = {
  service: new Subject<string>() /** Initialize service. */,
};

export const AppContext = createContext<IAppContext>(initialState);

const AppContextProvider: React.FC = ({ children }) => {
  return (
    <AppContext.Provider value={initialState}>{children}</AppContext.Provider>
  );
};

export default AppContextProvider;
```

Here, in line 9, we create our **subject** that we will use for communication. In line 13, we create a context to access the subject object in all components.

The context that we create needs to be presented application-wide. For this, the `AppContextProvider` component should be called in `index.tsx` file:

```tsx
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import AppContextProvider from "./Contexts/AppContext";

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

In line 10, the AppContextProvider is defined as the top component and the data presented by the context is presented to the App component and its subcomponents.

## 4. <a name='CreatingCommunicationComponents'></a>Creating Communication Components

As a communication, one component sends the changes made in the input to the other. The `InputBox.tsx` file is created in the `Components/` directory for the component that does the sending, as follows:

```tsx
import React from "react";
import { AppContext } from "../Contexts/AppContext";
import { useContext } from "react";

export default function InputBox() {
  const { service } = useContext(AppContext); // use context value

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    service.next(event.target.value); // Send over service
  };

  return (
    <div className="input-box">
      <input
        onChange={onChangeHandler}
        className="input-box__input"
        type="text"
        placeholder="Send Message Over Service..."
      />
    </div>
  );
}
```

Here, with the change event of the input, the content of the input is sent from our subject on line 10. With the **next** function, data flow takes place to each observer listening to the subject. With the useContext hook in line 6, we get the **service object** provided by the context.

The component that receives and displays the data stream is created in the `Components/` directory in the `TextField.tsx` file:

```tsx
import { AppContext } from "../Contexts/AppContext";
import { useContext, useEffect, useState } from "react";

export default function TextField() {
  const { service } = useContext(AppContext); // get service
  const [text, setText] = useState<string>("");

  useEffect(() => {
    let subscription = service.subscribe({
      next: (value) => {
        // when data changes
        setText(value); // set state.
      },
    });

    return () => {
      subscription.unsubscribe(); // unsubcsribe
    };
  }, [service]);

  return (
    <div className="text-field">
      <p className="text-field__text">{text}</p>
    </div>
  );
}
```

First, our required service object is listened to from the context (AppContext) with the useContext function. In the useEffect hook, the subject is subscribed to. After subscribing, the component starts receiving messages. When a message arrives, it is thrown to the text state object on the 15th line. And we unsubscribe from subject
for avoding memory leaks.

Thus, communication between two components is provided with the help of RxJS subject. With this structure, communication can be provided between any two or more components. In addition, more specific operations can be performed with advanced RxJS structures like **Schedulers, Operators**.

## 5. <a name='CloningThisRepoInstalling'></a>Cloning This Repo & Installing

```sh
git clone https://github.com/Spelchure/react-with-rxjs.git
cd react-with-rxjs
yarn
yarn start
```
