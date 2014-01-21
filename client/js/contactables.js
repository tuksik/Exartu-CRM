ContactablesController = RouteController.extend({
	template: 'contactables',
	layoutTemplate: 'mainLayout'
});

Template.contactables.rendered = function () {
	var viewModel = function () {
		var self = this;
		self.entities = ko.meteor.find(Contactables, {});
		self.contactableTypes = ko.observableArray();
		self.ready = ko.observable(false);

		Meteor.call('getContactableTypes', function (err, result) {
			if (!err) {
				self.contactableTypes(result);
				_.extend(self, helper.createObjTypefilter(['person.firstName', 'person.lastName', 'organization.organizationName'], result,
						function () {
							self.entities(ko.mapping.fromJS(Contactables.find(this.query).fetch())());
						})

				);

				self.ready(true);
			}
		});

		self.showAddContactableModal = function (typeId) {
			Session.set('newContactableTypeId', typeId);
			$('#addContactableModal').modal('show');
		};
	};
	helper.applyBindings(viewModel, 'contactablesVM');
};