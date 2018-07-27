const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const stripe = require('stripe')(functions.config().stripe.token),
      currency = functions.config().stripe.currency || 'USD';

const cors = require('cors')({origin: true});
// const cors = require('cors');

function debug(debugMessage) {
    console.log(debugMessage);
}

// PUSH (CLOUD FUNCTION)
exports.push = functions.https.onRequest((req, res) => {

  debug('push()');

  const vendorId = req.body.vendor;
  const promoId = req.body.promo;
  const authToken = req.body.auth;

  if (!authToken) {
      res.status(401).send({ error: 'Auth Token Required' })
  }

  // verify the token then handle the response within the callback
      admin.auth().verifyIdToken(authToken)
      .then(function(decodedToken) {
          const uid = decodedToken.uid;
          if (uid !== vendorId) {
              throw Error('VendorID and Auth token are not for same user - potential API attack');
          } else {
              pushPromotion(vendorId, promoId);
              res.send({ message: 'validated and sent for processing'});
          }
      }).catch(function(error) {
          debug('verifyIdToken Error: ' + error);
          res.status(500).send({ error: 'Token Verification Failed' });
      });
})

exports.pushToCustomer = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
      const vendorId = req.body.vendorId;
      const promoId = req.body.promoId;
      pushPromotion(vendorId, promoId);
      res.send({ message: 'validated and sent for processing'});
    })
})

function pushPromotion(vendorId, promoId) {
  const subscribers = admin.database().ref('/Subscriptions');
  // find the customers subscribed to the given vendor
  subscribers.orderByKey().equalTo(vendorId).once('value').then((snapshot) => {
      if (!snapshot.exists()) {
          // Do nothing! there are no users subscribed it seems
      } else {
          snapshot.forEach((childSnapshot) => {
              // SMELLS LIKE A SMELL...NESTED FOR EACH LOOPS!!!
              childSnapshot.forEach((snap) => {
                  let customerId = snap.key;
                  onCustomerIdRetrieved(customerId);
                  updateCustomerPromoTable(customerId, promoId, vendorId);
                  debug('push() customerId = snap.key: ' + customerId);
              });
          });
      }
  });
}

// message to device id after receiving it via callback
function cloudMessage(deviceId) {
  debug('cloudMessage(deviceId) <-- ' + deviceId);

  var payload = {
      notification: {
          title: "Loyalty Card",
          body: "New Promotion Received",
          sound: "default"
      }
  };
  admin.messaging().sendToDevice(deviceId, payload)
      .then(function (response) {
          // See the MessagingDevicesResponse reference documentation for the contents of response.
          debug("Successfully sent message: " + response.multicastId.toString());
      })
      .catch(function (error) {
         debug("Error sending message:" + error);
      });
}

// update promo table - add a reference to the promo id to the customer's table
function updateCustomerPromoTable(customerId, promoId, vendorId) {
  //debug('updateCustomerPromoTable(customerId, promoId, vendorId) <-- ' + customerId + ', ' + promoId + ', ' + vendorId);

  const ref = admin.database().ref('/Vouchers');
  const voucherRef = ref.push();
  voucherRef.set({
      promoID: promoId,
      customerID: customerId,
      vendorID: vendorId
  });
}

// when customerId is retrieved the device id should be called for
function onCustomerIdRetrieved(customerId) {
  const customers = admin.database().ref('/Customers');

  customers.orderByValue().equalTo(customerId).once('value').then((snapshot) => {
      if (!snapshot.exists()) {
          // Do nothing if there is no device id for the current customer
      } else {
          snapshot.forEach((childSnapshot) => {
              let deviceId = childSnapshot.key;
              debug('onCustomerIdRetrieved() deviceId = childSnapshot.key: ' + deviceId);
              cloudMessage(deviceId);
          });
      }
  })
}


// REGISTER (CLOUD FUNCTION)
exports.register = functions.https.onRequest((req, res) => {
  // get the InstanceID token (instance represents the android device, istance IDs may change frequently)
  const instanceId = req.body.token;

  if (req.body.uid) {
      const customerId = req.body.uid;
      const authToken = req.body.auth;
      const email = req.body.email;
      const name = req.body.name;

      admin.database().ref(`Role/${customerId}`).update({name:name, email: email, role: 3});

      // send a message to inform that the correct data wasn't received in the request
      if(!authToken) res.status(401).send({ error: 'Auth Token Required' });

      // verify the token then handle the response within the callback
      admin.auth().verifyIdToken(authToken)
      .then(function (decodedToken) {
          const uid = decodedToken.uid;
          // security check to make sure the user is associated with the account they are registering their instance against
          if (uid !== customerId) {
              throw Error('customerId does not match authentication - potential API attack');
          }
          // register the instanceId with the customer
          registerDeviceId(instanceId, customerId); // using the uid here could provide an extra layer of security
          res.send({ message: 'validated and sent for processing' });

      }).catch(function(error) {
          debug("verifyIdToken Error: ", error);
          res.status(500).send({ error: 'Token Verification Failed' });
      });
  } else {
      const customerId = "";
      // register instanceId with empty string as customerId
      registerDeviceId(instanceId, customerId);
  }
});

// register device instanceId with customerId or register with missing customerId
function registerDeviceId (instanceId, customerId) {
  // set the database reference
  const ref = admin.database().ref('/Customers');

  // find the reference associated with current customerId
  ref.orderByValue().equalTo(customerId).once('value').then(function (snapshot) {
      // set customerId as missing so that there will be no empty strings to match against
      if (customerId === "") {
          customerId = "missing";
      }

      if (!snapshot.exists()) {
          // if user is not already associated with an instanceId ??
          // adds a new child to Customers
          ref.update({ [instanceId]: customerId });
      } else {
          snapshot.forEach((childSnapshot) => {
              // if user is already associated with an instanceId
              if (childSnapshot.val() === "missing") {
                  // do nothing because we don't know if this is related to the customer calling this cloud function
              } else {
                  // remove the child key and update the ref with a new child --- CONSIDER OPTIMIZING TO CHECK IF DATA HAS CHANGED FIRST!!
                  const key = childSnapshot.key;
                  ref.child(key).remove();
                  ref.update({ [instanceId]: customerId });
              }
          });
      }
  });
}

exports.createStripeCustomer = functions.database.ref('/Vendors/{userid}').onCreate(event => {
    // user auth data
    const user = event.data.val();
    const userId = event.params.userid; //get from parameters
    //const userid = user.uid;
    // register Stripe user
    return stripe.customers.create({
        email: user.email
    })
    .then(function(customer)  {
       debug("View customer: ", "customer");
        const updates = {};
        updates[`/VendorCustomers/${customer.id}`]   = userId;
        updates[`/VendorUsers/${userId}/customerId`] = customer.id;
        
        return admin.database().ref().update(updates);
      });
  });


  exports.createSubscription = functions.database.ref('/VendorUsers/{userId}/membership/token').onWrite(event => {
                                
    const tokenId = event.data.val();
    const userId  = event.params.userId;
    
    
    if (!tokenId) throw new Error('token missing');
    
    return admin.database()
    .ref(`/VendorUsers/${userId}`)
    .once('value')
    .then(snapshot => snapshot.val())
    .then(user => {
      
      return stripe.subscriptions.create({
        customer: user.customerId,
        source: tokenId,
        items: [
              {
                plan: 'monthly_loycard',
              },
            ],
          });
      })
      .then(sub => {
              admin.database()
              .ref(`/VendorUsers/${userId}/membership`)
              .update( {status: 'active', stripeSubId: sub.id} )
      })
      .catch(err => console.log(err))
  });

  exports.cancelSubscription = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        const id = req.body.stripeSubId;
        console.log('|||||||||||| id: ', id);
        callStripeDelAPI(req.body.stripeSubId);
        res.send({ message: 'validated and sent for processing'});
    })
})

function callStripeDelAPI(stripeSubId) {
    stripe.subscriptions.del(stripeSubId, (err, confirmation) => {
        console.log('err: ', err);
        console.log('=====stripe subscription confirmed: ', confirmation);
    })
}

  exports.recurringPayment = functions.https.onRequest((req, res) => {
    const hook  = req.body.type
    const data  = req.body.data.object
    if (!data) throw new Error('missing data')
    
    return admin.database()
      .ref(`/VendorCustomers/${data.customer}`)
    	.once('value')
    	.then(snapshot => snapshot.val())
    	.then((userId) => {
      	const ref = admin.database().ref(`/VendorUsers/${userId}/membership`)
          // Handle successful payment webhook
          if (hook === 'invoice.payment_succeeded') {
      			return ref.update({ status: 'active' });
   				 }
          // Handle failed payment webhook
          if (hook === 'invoice.payment_failed') {
            return ref.update({ status: 'pastDue' });
          }
       })
       .then(() => res.status(200).send(`successfully handled ${hook}`) )
       .catch(err => res.status(400).send(`error handling ${hook}`))
});






