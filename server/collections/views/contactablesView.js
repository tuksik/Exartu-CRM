
ContactablesView = new Mongo.Collection('contactablesView');

Meteor.paginatedPublish(ContactablesView, function () {
        if (!this.userId)
            return [];
        return Utils.filterCollectionByUserHier.call(this, ContactablesView.find({},
                {
                    fields: {
                        location: 0
                    },
                    sort: {
                        dateCreated: -1
                    }
                })
        );
    },
    {
        pageSize: 20,
        publicationName: 'contactablesView'
    }
);



/// hooks

//notes
Notes.after.insert(function (userId, note) {
  _.each(note.links, function (link) {
    if (link.type == Enums.linkTypes.contactable.value){
      ContactablesView.update(link.id, {
        $set: {
          lastNote:{
            userId: note.userId,
            msg: note.msg,
            dateCreated: note.dateCreated
          }
        }
      });
    }
  })
});
Notes.after.update(function (userId, note, fieldNames, modifier) {
  // todo: check if links are edited

  if (modifier.$set && modifier.$set.msg){
    _.each(note.links, function (link) {
      if (link.type == Enums.linkTypes.contactable.value){
        ContactablesView.update(link.id, {
          $set: {
            'lastNote.msg': note.msg
          }
        });
      }
    })
  }
});


// Indexes

ContactablesView._ensureIndex({hierId: 1});
ContactablesView._ensureIndex({'dateCreated': 1});
ContactablesView._ensureIndex({objNameArray: 1});
ContactablesView._ensureIndex({'Employee.status': 1});
ContactablesView._ensureIndex({'Client.status': 1});
ContactablesView._ensureIndex({'Contact.status': 1});
ContactablesView._ensureIndex({'activeStatus': 1});
ContactablesView._ensureIndex({userId: 1});
