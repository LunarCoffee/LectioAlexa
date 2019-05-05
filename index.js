const Alexa = require('ask-sdk-core');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Hi! You can ask me to listen to you read.';
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const GoToPageIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'GoToPageIntent';
    },
    handle(handlerInput) {
        const book = handlerInput.requestEnvelope.request.intent.slots.book.value;
        return handlerInput.responseBuilder
            .speak(`Okay. I'm following you in ${book}.`)
            .reprompt("You can start reading now.")
            .getResponse();
    }
};

function clean(text) {
    return text.trim().toLowerCase().replace(/[^A-Za-z0-9\s]/g,"").replace(/\s{2,}/g, " ");
}

// Page 55, Tucket's Gold
const sampleText = `that was a good sign. ridden horses were not allowed to stop at every little bit of grass.`;

// Page 63, Brian's Hunt
const sampleText2 = "And so he packed the canoe and when it was packed he tied cord to the two back quarters of the deer to hang them over in the water.";

function compare(str, correct) {
    let incorrect_array = [];
    let str_array = clean(str).split(' ');
    
    let correct_array = clean(correct).split(" ");
    
    for (let i = 0; i < correct_array.length; i++) {
        if ((correct_array[i] === str_array[i]) ||
            (correct_array[i - 1] === str_array[i]) ||
            (correct_array[i + 1] === str_array[i])){
        } else {
            incorrect_array.push(correct_array[i]);
        }
    }
    
    return incorrect_array.filter(s => s).join(", ");
}

const FromTheBookIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "FromTheBookIntent";
    },
    handle(handlerInput) {
        const input = handlerInput.requestEnvelope.request.intent.slots.text.value;
        let response = "Something went wrong...";
        
        let incorrect = compare(input, sampleText2);
        if (incorrect.length > 0) {
            response = `You got the words ${incorrect}, incorrect.`
        } else {
            response = "You read that perfectly!"
        }
        
        return handlerInput.responseBuilder
            .speak(response)
            .getResponse();
    }
}

const FromTheBookTucketIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "FromTheBookTucketIntent";
    },
    handle(handlerInput) {
        const input = handlerInput.requestEnvelope.request.intent.slots.text.value;
        let response = "Something went wrong...";
        
        let incorrect = compare(input, sampleText);
        if (incorrect.length > 0) {
            response = `You got the words, ${incorrect}, incorrect.`
        } else {
            response = "You read that perfectly!"
        }
        
        return handlerInput.responseBuilder
            .speak(response)
            .getResponse();
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const EatMyHatIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'EatMyHatIntent';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder
            .speak("Mmm. That was a good hat.")
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speechText = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = handlerInput.requestEnvelope.request.intent.name;
        const speechText = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speechText)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.message}`);
        const speechText = `Sorry, I couldn't understand what you said. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        GoToPageIntentHandler,
        FromTheBookIntentHandler,
        FromTheBookTucketIntentHandler,
        HelpIntentHandler,
        EatMyHatIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler) // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
