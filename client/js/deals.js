DealsController = RouteController.extend({
    template: 'deals'
});


DealsVM = function (searchcriteria) {
    var self = this;
    self.entities = ko.meteor.find(Deals, {});
    self.dealTypes = ko.observableArray();
    self.ready = ko.observable(false);
    Meteor.call('getDealTypes', function (err, result) {
        if (!err) {
            self.dealTypes(result);
            _.extend(self, helper.createObjTypefilter([], result,
                function () {
                    self.entities(ko.mapping.fromJS(Deals.find(this.query).fetch())());
                })

            );
            self.ready(true);
        }
    });
};

Template.deals.rendered = function () {
    helper.applyBindings(DealsVM, 'dealsVM');
};