/*
 * A way to communicate with other system's users. It's private.
 *
 * Message:
 *  - dateCreated: date created
 *  - begin: date beginning
 *  - end: date
 *  - completed: date completed
 *  - assign: array of user's ids that are assigned to this task
 *  - state (calculated in client's transform)
 */

Meteor.publish('tasks', function () {
  if (!this.userId)
    return false;
  var user = Meteor.users.findOne({
      _id: this.userId
  });


  return Tasks.find({
        $or: filterByHiers(user.currentHierId)
    });

//  return Tasks.find({
//    $or: [
//      {
//        userId: this.userId
//      },
//      {
//        assign: this.userId
//      }
//    ]
//  });
})

Meteor.startup(function () {
  Meteor.methods({
    createTask: function (task) {
      Tasks.insert(task);
    }
  });
});

Tasks.before.insert(function (userId, doc) {
//  if (this.connection) {
    var user = Meteor.user();
    doc.hierId = user.currentHierId;
    doc.userId = user._id;
//  }
    doc.dateCreated = Date.now();
});
Tasks.allow({
  update: function (userId, doc, fields, modifier) {
    // todo: check hiers
    return true;
  },
  insert: function (userId, doc, fields, modifier) {
    // todo: check hiers
    return true;
  }
})

// indexes
Tasks._ensureIndex({hierId: 1});
Tasks._ensureIndex({assign: 1});
Tasks._ensureIndex({userId: 1});