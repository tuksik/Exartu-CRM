/**
 * Variables
 */
var JobHandler;

/**
 * Controller
 */
JobsController = RouteController.extend({
  template: 'jobs',
  layoutTemplate: 'mainLayout',
  waitOn: function() {
    if (!SubscriptionHandlers.JobHandler){
      SubscriptionHandlers.JobHandler = SubscriptionHandlers.JobHandler || Meteor.paginatedSubscribe('jobs');
    }
    JobHandler = SubscriptionHandlers.JobHandler;
    return [JobHandler, LookUpsHandler];
  },
  onAfterAction: function() {
    var title = 'Jobs',
    description = 'Manage your list here';
    SEO.set({
      title: title,
      meta: {
        'description': description
      },
      og: {
        'title': title,
        'description': description
      }
    });
  },
  action: function(){
    if (this.ready())
      this.render();
    else
      this.render('loadingContactable');
    this.render();
  }
});

/**
 * Helpers
 */
// Jobs - Helpers
Template.jobs.helpers({
  jobCount: function(){
    return JobHandler.totalCount();
  }
});