Contactables = new Meteor.Collection("contactables");

Meteor.methods({
	addContactable: function (contactable) {
        console.log("adding contactable "+Meteor.userId());
        console.dir(contactable);
        if (Meteor.userId()){
           return Contactables.insert(contactable);
        }
        return null;
		
	},
});